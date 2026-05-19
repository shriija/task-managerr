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

  // ── Trash State ─────────────────────────────────────────
  deletedBoards: [],
  deletedLists: [],
  deletedCards: [],

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

  const sourceList = lists.find(l => l._id === fromListId)

  if (!sourceList) return

  const movedCard = sourceList.cards.find(c => c._id === cardId)

  if (!movedCard) return

  const updatedLists = lists.map(l => {

    // Same list reorder
    if (fromListId === toListId && l._id === fromListId) {

      const cards = [...l.cards]

      const oldIdx = cards.findIndex(c => c._id === cardId)

      if (oldIdx === -1) return l

      const [moved] = cards.splice(oldIdx, 1)

      cards.splice(newPosition, 0, moved)

      return {
        ...l,
        cards
      }
    }

    // Remove from source
    if (l._id === fromListId) {

      return {
        ...l,
        cards: l.cards.filter(c => c._id !== cardId)
      }
    }

    // Add to destination
    if (l._id === toListId) {

      const cards = [...l.cards]

      cards.splice(newPosition, 0, {
        ...movedCard,
        list: toListId
      })

      return {
        ...l,
        cards
      }
    }

    return l
  })

  set({
    lists: updatedLists
  })
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
      const { cardId, listId, updates, targetListId } = data
      const destListId = targetListId || (updates && updates.list) || listId
      
      const { lists } = get()
      let updatedLists = [...lists]
      
      if (listId !== destListId) {
        // Find card to move
        const sourceList = lists.find(l => l._id === listId)
        const movedCard = sourceList?.cards.find(c => c._id === cardId) || updates
        
        // Remove from old list
        updatedLists = updatedLists.map(l => {
          if (l._id === listId) {
            return { ...l, cards: l.cards.filter(c => c._id !== cardId) }
          }
          return l
        })
        
        // Add/Update in new list
        updatedLists = updatedLists.map(l => {
          if (l._id === destListId) {
            const alreadyExists = l.cards?.some(c => c._id === cardId)
            if (alreadyExists) {
              return { ...l, cards: l.cards.map(c => c._id === cardId ? { ...c, ...updates } : c) }
            }
            return { ...l, cards: [...(l.cards || []), { ...movedCard, ...updates }] }
          }
          return l
        })
      } else {
        // Simple update in same list
        updatedLists = updatedLists.map(l =>
          l._id === listId
            ? {
                ...l,
                cards: l.cards.map(c =>
                  c._id === cardId ? { ...c, ...updates } : c
                )
              }
            : l
        )
      }
      
      set({ lists: updatedLists })
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

  updateCard: async (cardId, listId, updates) => {
    const boardId = get().board?._id
    const stateUpdates = { ...updates }
    if (updates.description !== undefined) stateUpdates.description = updates.description

    // Optimistic UI updates
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

    try {
      const res = await axios.put(`${API}/card-api/updateCard/${cardId}`, {
        title: updates.title,
        description: updates.description,
        dueDate: updates.dueDate,
        priority: updates.priority,
        status: updates.status,
        assignedTo: updates.assignedTo && typeof updates.assignedTo === 'object' ? updates.assignedTo._id : updates.assignedTo
      }, { withCredentials: true })

      const savedCard = res.data.payload
      const targetListId = savedCard.list

      const { lists } = get()
      let updatedLists = [...lists]

      if (listId !== targetListId) {
        // Remove from old list
        updatedLists = updatedLists.map(l => {
          if (l._id === listId) {
            return { ...l, cards: l.cards.filter(c => c._id !== cardId) }
          }
          return l
        })
        // Add to new list
        updatedLists = updatedLists.map(l => {
          if (l._id === targetListId) {
            return { ...l, cards: [...(l.cards || []), savedCard] }
          }
          return l
        })
      } else {
        // Just update in the same list
        updatedLists = updatedLists.map(l => {
          if (l._id === listId) {
            return {
              ...l,
              cards: l.cards.map(c => c._id === cardId ? savedCard : c)
            }
          }
          return l
        })
      }

      set({ lists: updatedLists })

      // If a new assignee is set, refetch board to synchronize header member list
      if (updates.assignedTo && boardId) {
        axios.get(`${API}/board-api/${boardId}`, { withCredentials: true }).then(boardRes => {
          set({ board: boardRes.data.payload })
        }).catch(() => {})
      }

      if (boardId) {
        socketService.emitCardUpdated(boardId, { cardId, listId, updates: savedCard, targetListId })
      }
    } catch (error) {
      if (boardId) get().fetchBoard(boardId)
    }
  },

  moveCard: (cardId, fromListId, toListId, newPosition) => {

  const boardId = get().board?._id

  const { lists } = get()

  const sourceList = lists.find(l => l._id === fromListId)

  if (!sourceList) return

  const movedCard = sourceList.cards.find(c => c._id === cardId)

  if (!movedCard) return

  const updatedLists = lists.map(l => {

    // Same list reorder
    if (fromListId === toListId && l._id === fromListId) {

      const cards = [...l.cards]

      const oldIdx = cards.findIndex(c => c._id === cardId)

      if (oldIdx === -1) return l

      const [moved] = cards.splice(oldIdx, 1)

      cards.splice(newPosition, 0, moved)

      return {
        ...l,
        cards
      }
    }

    // Remove from source
    if (l._id === fromListId) {

      return {
        ...l,
        cards: l.cards.filter(c => c._id !== cardId)
      }
    }

    // Add to destination
    if (l._id === toListId) {

      const cards = [...l.cards]

      cards.splice(newPosition, 0, {
        ...movedCard,
        list: toListId
      })

      return {
        ...l,
        cards
      }
    }

    return l
  })

  set({
    lists: updatedLists
  })

  axios.put(
    `${API}/card-api/moveCard/${cardId}`,
    { toListId, newPosition },
    { withCredentials: true }
  ).catch(() => {})

  if (boardId) {

    socketService.emitCardMoved(boardId, {
      cardId,
      fromListId,
      toListId,
      newPosition
    })
  }
},
  reset: () => {
    const boardId = get().board?._id
    if (boardId) socketService.leaveBoard(boardId)
    set({ board: null, lists: [], loading: false, error: null, onlineUsers: [] })
  },

  // ── Trash Actions ────────────────────────────────────────
  fetchDeletedBoards: async () => {
    try {
      const res = await axios.get(`${API}/board-api/trash/deleted`, { withCredentials: true })
      set({ deletedBoards: res.data.payload || [] })
    } catch (err) { console.error(err) }
  },

  restoreBoard: async (boardId) => {
    try {
      await axios.put(`${API}/board-api/restore/${boardId}`, {}, { withCredentials: true })
      set(state => ({ deletedBoards: state.deletedBoards.filter(b => b._id !== boardId) }))
    } catch (err) { console.error(err) }
  },

  permanentDeleteBoard: async (boardId) => {
    try {
      await axios.delete(`${API}/board-api/permanent/${boardId}`, { withCredentials: true })
      set(state => ({ deletedBoards: state.deletedBoards.filter(b => b._id !== boardId) }))
    } catch (err) { console.error(err) }
  },

  fetchDeletedListsAndCards: async (boardId) => {
    try {
      const [listsRes, cardsRes] = await Promise.all([
        axios.get(`${API}/list-api/trash/deleted/${boardId}`, { withCredentials: true }),
        axios.get(`${API}/card-api/trash/deleted/${boardId}`, { withCredentials: true })
      ])
      set({
        deletedLists: listsRes.data.payload || [],
        deletedCards: cardsRes.data.payload || []
      })
    } catch (err) { console.error(err) }
  },

  restoreList: async (listId, boardId) => {
    try {
      await axios.put(`${API}/list-api/restore/${listId}`, {}, { withCredentials: true })
      get().fetchDeletedListsAndCards(boardId)
      get().fetchBoard(boardId)
    } catch (err) { console.error(err) }
  },

  permanentDeleteList: async (listId) => {
    try {
      await axios.delete(`${API}/list-api/permanent/${listId}`, { withCredentials: true })
      set(state => ({ deletedLists: state.deletedLists.filter(l => l._id !== listId) }))
    } catch (err) { console.error(err) }
  },

  restoreCard: async (cardId, boardId) => {
    try {
      await axios.put(`${API}/card-api/restore/${cardId}`, {}, { withCredentials: true })
      get().fetchDeletedListsAndCards(boardId)
      get().fetchBoard(boardId)
    } catch (err) { console.error(err) }
  },

  permanentDeleteCard: async (cardId) => {
    try {
      await axios.delete(`${API}/card-api/permanent/${cardId}`, { withCredentials: true })
      set(state => ({ deletedCards: state.deletedCards.filter(c => c._id !== cardId) }))
    } catch (err) { console.error(err) }
  },

  // ── Collaboration Actions ─────────────────────────────────────

  // Add a registered user to the board by their login email
  inviteByEmail: async (boardId, email) => {
    const res = await axios.post(
      `${API}/board-api/invite/email/${boardId}`,
      { email },
      { withCredentials: true }
    )
    // Update local board state with the new member list
    set({ board: res.data.payload })
    return res.data
  },

  // Generate (or retrieve) a shareable invite link for the board
  generateInviteLink: async (boardId) => {
    const res = await axios.post(
      `${API}/board-api/invite/link/${boardId}`,
      {},
      { withCredentials: true }
    )
    return res.data.payload // { link, token }
  },

}))