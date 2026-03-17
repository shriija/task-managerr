import { create } from "zustand"
import axios from "axios"
import { API_URL as API } from "../services/api"

export const useBoardStore = create((set, get) => ({

  // ── State ──────────────────────────────────────────────
  board: null,
  lists: [],
  loading: false,
  error: null,

  // ── Fetch board + lists + cards ────────────────────────
  fetchBoard: async (boardId) => {
    try {
      set({ loading: true, error: null })

      // 1️⃣ Fetch board
      const res = await axios.get(
        `${API}/board-api/${boardId}`,
        { withCredentials: true }
      )

      const board = res.data.payload

      // 2️⃣ Fetch lists of this board
      let lists = []
      try {
        const listRes = await axios.get(
          `${API}/list-api/getLists/${boardId}`,
          { withCredentials: true }
        )

        lists = listRes.data?.payload || []
      } catch {
        lists = []
      }

      // ⭐ 3️⃣ Fetch cards for each list (FIXED PART)
      const listsWithCards = await Promise.all(
        lists.map(async (list) => {
          try {
            const cardRes = await axios.get(
              `${API}/card-api/getCards/${list._id}`,
              { withCredentials: true }
            )

            return {
              ...list,
              cards: cardRes.data?.payload || []
            }
          } catch {
            return {
              ...list,
              cards: []
            }
          }
        })
      )

      // ⭐ 4️⃣ Save combined data
      set({
        board,
        lists: listsWithCards,
        loading: false
      })

    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to load board"
      })
    }
  },

  // ── List Actions ───────────────────────────────────────
  addList: async (boardId, title) => {
    const { lists } = get()
    const position = lists.length

    const tempList = {
      _id: `temp-${Date.now()}`,
      title,
      board: boardId,
      position,
      cards: []
    }

    set({ lists: [...lists, tempList] })

    try {
      const res = await axios.post(
        `${API}/list-api/addList`,
        { title, board: boardId, position },
        { withCredentials: true }
      )

      const saved = res.data.payload

      set({
        lists: get().lists.map(l =>
          l._id === tempList._id ? { ...saved, cards: [] } : l
        )
      })
    } catch {
      set({ lists: get().lists.filter(l => l._id !== tempList._id) })
    }
  },

  updateListTitle: (listId, newTitle) => {
    set({
      lists: get().lists.map(l =>
        l._id === listId ? { ...l, title: newTitle } : l
      )
    })

    axios.put(
      `${API}/list-api/${listId}`,
      { title: newTitle },
      { withCredentials: true }
    ).catch(() => {})
  },

  deleteList: (listId) => {
    set({ lists: get().lists.filter(l => l._id !== listId) })

    axios.delete(
      `${API}/list-api/deleteList/${listId}`,
      { withCredentials: true }
    ).catch(() => {})
  },

  // ── Card Actions ───────────────────────────────────────
  addCard: async (listId, title) => {
    const { lists } = get()
    const targetList = lists.find(l => l._id === listId)
    if (!targetList) return

    const position = targetList.cards?.length || 0

    const tempCard = {
      _id: `temp-${Date.now()}`,
      title,
      desc: "",
      list: listId,
      position,
      labels: [],
      dueDate: null
    }

    set({
      lists: lists.map(l =>
        l._id === listId
          ? { ...l, cards: [...(l.cards || []), tempCard] }
          : l
      )
    })

    try {
      const res = await axios.post(
        `${API}/card-api/addCard`,
        { title, list: listId, position },
        { withCredentials: true }
      )

      const saved = res.data.payload

      set({
        lists: get().lists.map(l =>
          l._id === listId
            ? {
                ...l,
                cards: l.cards.map(c =>
                  c._id === tempCard._id ? saved : c
                )
              }
            : l
        )
      })
    } catch {
      set({
        lists: get().lists.map(l =>
          l._id === listId
            ? { ...l, cards: l.cards.filter(c => c._id !== tempCard._id) }
            : l
        )
      })
    }
  },

  deleteCard: (cardId, listId) => {
    set({
      lists: get().lists.map(l =>
        l._id === listId
          ? { ...l, cards: l.cards.filter(c => c._id !== cardId) }
          : l
      )
    })

    axios.delete(
      `${API}/card-api/deleteCards/${cardId}`,
      { withCredentials: true }
    ).catch(() => {})
  },

  updateCard: (cardId, listId, updates) => {
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

    axios.put(
      `${API}/card-api/updateCard/${cardId}`,
      { ...updates, description: updates.desc },
      { withCredentials: true }
    ).catch(() => {})
  },

  moveCard: (cardId, fromListId, toListId, newPosition) => {
    const { lists } = get()

    if (fromListId === toListId) {
      set({
        lists: lists.map(l => {
          if (l._id !== fromListId) return l
          const cards = [...l.cards]
          const oldIdx = cards.findIndex(c => c._id === cardId)
          if (oldIdx === -1 || newPosition < 0 || newPosition >= cards.length) return l
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
  },

  // ── Reset ──────────────────────────────────────────────
  reset: () => set({ board: null, lists: [], loading: false, error: null })

}))