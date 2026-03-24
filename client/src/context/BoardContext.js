import { create } from "zustand"
import axios from "axios"
import { API_URL as API } from "../services/api"
import * as socketService from "../socket/socketService"

export const useBoardStore = create((set, get) => ({

  // ── State ──────────────────────────────────────────────
  board: null,
  lists: [],
  loading: false,
  error: null,
  onlineUsers: [],

  // ── Socket Listeners ───────────────────────────────────
  setupSocket: (socket) => {
    if (!socket) return

    // Clean up old listeners
    socket.off("card-moved")
    socket.off("card-added")
    socket.off("card-updated")
    socket.off("card-deleted")
    socket.off("list-added")
    socket.off("list-updated")
    socket.off("list-deleted")
    socket.off("online-users")

    socket.on("card-moved", (data) => {
      const { cardId, fromListId, toListId, newPosition } = data
      const { lists } = get()
      
      if (fromListId === toListId) {
        set({
          lists: lists.map(l => {
            if (l._id !== fromListId) return l
            const cards = [...l.cards]
            const oldIdx = cards.findIndex(c => c._id === cardId)
            if (oldIdx === -1) return l
            const [moved] = cards.splice(oldIdx, 1)
            cards.splice(newPosition, 0, moved)
            return { ...l, cards }
          })
        })
      } else {
        let movedCard = null
        set({
          lists: lists.map(l => {
            if (l._id === fromListId) {
              movedCard = l.cards.find(c => c._id === cardId)
              return { ...l, cards: l.cards.filter(c => c._id !== cardId) }
            }
            if (l._id === toListId && movedCard) {
              const cards = [...l.cards]
              cards.splice(newPosition, 0, { ...movedCard, list: toListId })
              return { ...l, cards }
            }
            return l
          })
        })
      }
    })

    socket.on("card-added", (data) => {
      const { card, listId } = data
      set({
        lists: get().lists.map(l =>
          l._id === listId ? { ...l, cards: [...(l.cards || []), card] } : l
        )
      })
    })

    socket.on("card-updated", (data) => {
      const { cardId, listId, updates } = data
      set({
        lists: get().lists.map(l =>
          l._id === listId
            ? {
                ...l,
                cards: l.cards.map(c =>
                  c._id === cardId ? { ...c, ...updates } : c
                )
              }
            : l
        )
      })
    })

    socket.on("card-deleted", (data) => {
      const { cardId, listId } = data
      set({
        lists: get().lists.map(l =>
          l._id === listId
            ? { ...l, cards: l.cards.filter(c => c._id !== cardId) }
            : l
        )
      })
    })

    socket.on("list-added", (data) => {
      const { list } = data
      set({ lists: [...get().lists, { ...list, cards: [] }] })
    })

    socket.on("list-updated", (data) => {
      const { listId, title } = data
      set({
        lists: get().lists.map(l =>
          l._id === listId ? { ...l, title } : l
        )
      })
    })

    socket.on("list-deleted", (data) => {
      const { listId } = data
      set({ lists: get().lists.filter(l => l._id !== listId) })
    })

    socket.on("online-users", (users) => {
      set({ onlineUsers: users })
    })
  },

  // ── Fetch board + lists + cards ────────────────────────
  fetchBoard: async (boardId) => {
    try {
      set({ loading: true, error: null })

      const res = await axios.get(`${API}/board-api/${boardId}`, { withCredentials: true })
      const board = res.data.payload

      let lists = []
      try {
        const listRes = await axios.get(`${API}/list-api/getLists/${boardId}`, { withCredentials: true })
        lists = listRes.data?.payload || []
      } catch {
        lists = []
      }

      const listsWithCards = await Promise.all(
        lists.map(async (list) => {
          try {
            const cardRes = await axios.get(`${API}/card-api/getCards/${list._id}`, { withCredentials: true })
            return { ...list, cards: cardRes.data?.payload || [] }
          } catch {
            return { ...list, cards: [] }
          }
        })
      )

      set({ board, lists: listsWithCards, loading: false })
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "Failed to load board" })
    }
  },

  // ── List Actions ───────────────────────────────────────
  addList: async (boardId, title) => {
    const { lists } = get()
    const position = lists.length
    const tempList = { _id: `temp-${Date.now()}`, title, board: boardId, position, cards: [] }

    set({ lists: [...lists, tempList] })

    try {
      const res = await axios.post(`${API}/list-api/addList`, { title, board: boardId, position }, { withCredentials: true })
      const saved = res.data.payload
      set({
        lists: get().lists.map(l => l._id === tempList._id ? { ...saved, cards: [] } : l)
      })
      socketService.emitListAdded(boardId, { list: saved })
    } catch {
      set({ lists: get().lists.filter(l => l._id !== tempList._id) })
    }
  },

  updateListTitle: (listId, newTitle) => {
    const boardId = get().board?._id
    set({
      lists: get().lists.map(l => l._id === listId ? { ...l, title: newTitle } : l)
    })
    axios.put(`${API}/list-api/updateList/${listId}`, { title: newTitle }, { withCredentials: true }).catch(() => {})
    if (boardId) socketService.emitListUpdated(boardId, { listId, title: newTitle })
  },

  deleteList: (listId) => {
    const boardId = get().board?._id
    set({ lists: get().lists.filter(l => l._id !== listId) })
    axios.delete(`${API}/list-api/deleteList/${listId}`, { withCredentials: true }).catch(() => {})
    if (boardId) socketService.emitListDeleted(boardId, { listId })
  },

  // ── Card Actions ───────────────────────────────────────
  addCard: async (listId, title) => {
    const boardId = get().board?._id
    const { lists } = get()
    const targetList = lists.find(l => l._id === listId)
    if (!targetList) return

    const position = targetList.cards?.length || 0
    const tempCard = { _id: `temp-${Date.now()}`, title, description: "", list: listId, position, labels: [], dueDate: null, priority: "" }

    set({
      lists: lists.map(l => l._id === listId ? { ...l, cards: [...(l.cards || []), tempCard] } : l)
    })

    try {
      const res = await axios.post(`${API}/card-api/addCard`, { title, list: listId, position }, { withCredentials: true })
      const saved = res.data.payload
      set({
        lists: get().lists.map(l =>
          l._id === listId ? { ...l, cards: l.cards.map(c => c._id === tempCard._id ? saved : c) } : l
        )
      })
      if (boardId) socketService.emitCardAdded(boardId, { card: saved, listId })
    } catch {
      set({
        lists: get().lists.map(l => l._id === listId ? { ...l, cards: l.cards.filter(c => c._id !== tempCard._id) } : l)
      })
    }
  },

  deleteCard: (cardId, listId) => {
    const boardId = get().board?._id
    set({
      lists: get().lists.map(l => l._id === listId ? { ...l, cards: l.cards.filter(c => c._id !== cardId) } : l)
    })
    axios.delete(`${API}/card-api/deleteCards/${cardId}`, { withCredentials: true }).catch(() => {})
    if (boardId) socketService.emitCardDeleted(boardId, { cardId, listId })
  },

  updateCard: (cardId, listId, updates) => {
    const boardId = get().board?._id
    const stateUpdates = { ...updates }
    if (updates.description !== undefined) stateUpdates.description = updates.description

    set({
      lists: get().lists.map(l =>
        l._id === listId
          ? {
              ...l,
              cards: l.cards.map(c => c._id === cardId ? { ...c, ...stateUpdates } : c)
            }
          : l
      )
    })

    axios.put(`${API}/card-api/updateCard/${cardId}`, {
      title: updates.title,
      description: updates.description,
      dueDate: updates.dueDate,
      priority: updates.priority
    }, { withCredentials: true }).catch(() => {})

    if (boardId) socketService.emitCardUpdated(boardId, { cardId, listId, updates: stateUpdates })
  },

  moveCard: (cardId, fromListId, toListId, newPosition) => {
    const boardId = get().board?._id
    const { lists } = get()

    if (fromListId === toListId) {
      set({
        lists: lists.map(l => {
          if (l._id !== fromListId) return l
          const cards = [...l.cards]
          const oldIdx = cards.findIndex(c => c._id === cardId)
          if (oldIdx === -1) return l
          const [moved] = cards.splice(oldIdx, 1)
          cards.splice(newPosition, 0, moved)
          return { ...l, cards }
        })
      })
    } else {
      let movedCard = null
      set({
        lists: lists.map(l => {
          if (l._id === fromListId) {
            movedCard = l.cards.find(c => c._id === cardId)
            return { ...l, cards: l.cards.filter(c => c._id !== cardId) }
          }
          if (l._id === toListId && movedCard) {
            const cards = [...l.cards]
            cards.splice(newPosition, 0, { ...movedCard, list: toListId })
            return { ...l, cards }
          }
          return l
        })
      })
    }

    axios.put(`${API}/card-api/moveCard/${cardId}`, { toListId, newPosition }, { withCredentials: true }).catch(() => {})
    if (boardId) socketService.emitCardMoved(boardId, { cardId, fromListId, toListId, newPosition })
  },

  reset: () => {
    const boardId = get().board?._id
    if (boardId) socketService.leaveBoard(boardId)
    set({ board: null, lists: [], loading: false, error: null, onlineUsers: [] })
  }

}))