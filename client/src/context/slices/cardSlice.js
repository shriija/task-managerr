import axios from "axios";
import { API_URL as API } from "../../services/api";
import * as socketService from "../../socket/socketService";

export const createCardSlice = (set, get) => ({
  addCard: async (listId, title, additionalFields = {}) => {
    const boardId = get().board?._id;
    const { lists } = get();
    const targetList = lists.find(l => l._id === listId);
    if (!targetList) return;

    const position = targetList.cards?.length || 0;
    const tempCard = { _id: `temp-${Date.now()}`, title, description: "", list: listId, position, labels: [], dueDate: null, priority: "", ...additionalFields };

    set({
      lists: lists.map(l => l._id === listId ? { ...l, cards: [...(l.cards || []), tempCard] } : l)
    });

    try {
      const res = await axios.post(`${API}/card-api/addCard`, { title, list: listId, position, ...additionalFields }, { withCredentials: true });
      const saved = res.data.payload;
      set({
        lists: get().lists.map(l =>
          l._id === listId ? { ...l, cards: l.cards.map(c => c._id === tempCard._id ? saved : c) } : l
        )
      });
      if (boardId) socketService.emitCardAdded(boardId, { card: saved, listId });
    } catch {
      set({
        lists: get().lists.map(l => l._id === listId ? { ...l, cards: l.cards.filter(c => c._id !== tempCard._id) } : l)
      });
    }
  },

  deleteCard: (cardId, listId) => {
    const boardId = get().board?._id;
    set({
      lists: get().lists.map(l => l._id === listId ? { ...l, cards: l.cards.filter(c => c._id !== cardId) } : l)
    });
    axios.delete(`${API}/card-api/deleteCards/${cardId}`, { withCredentials: true }).catch(() => {});
    if (boardId) socketService.emitCardDeleted(boardId, { cardId, listId });
  },

  updateCard: async (cardId, listId, updates) => {
    const boardId = get().board?._id;
    const stateUpdates = { ...updates };
    if (updates.description !== undefined) stateUpdates.description = updates.description;

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
    });

    try {
      const res = await axios.put(`${API}/card-api/updateCard/${cardId}`, {
        title: updates.title,
        description: updates.description,
        dueDate: updates.dueDate,
        priority: updates.priority,
        status: updates.status,
        assignedTo: updates.assignedTo && typeof updates.assignedTo === 'object' ? updates.assignedTo._id : updates.assignedTo,
        assignees: updates.assignees ? updates.assignees.map(a => typeof a === 'object' ? a._id : a) : undefined
      }, { withCredentials: true });

      const savedCard = res.data.payload;
      const targetListId = savedCard.list;

      const { lists } = get();
      let updatedLists = [...lists];

      if (listId !== targetListId) {
        updatedLists = updatedLists.map(l => {
          if (l._id === listId) {
            return { ...l, cards: l.cards.filter(c => c._id !== cardId) };
          }
          return l;
        });
        updatedLists = updatedLists.map(l => {
          if (l._id === targetListId) {
            return { ...l, cards: [...(l.cards || []), savedCard] };
          }
          return l;
        });
      } else {
        updatedLists = updatedLists.map(l => {
          if (l._id === listId) {
            return {
              ...l,
              cards: l.cards.map(c => c._id === cardId ? savedCard : c)
            };
          }
          return l;
        });
      }

      set({ lists: updatedLists });

      if (updates.assignedTo && boardId) {
        axios.get(`${API}/board-api/${boardId}`, { withCredentials: true }).then(boardRes => {
          set({ board: boardRes.data.payload });
        }).catch(() => {});
      }

      if (boardId) {
        socketService.emitCardUpdated(boardId, { cardId, listId, updates: savedCard, targetListId });
      }
    } catch (error) {
      if (boardId) get().fetchBoard(boardId);
    }
  },

  syncCardUpdate: (updatedCard) => {
    const boardId = get().board?._id;
    const cardId = updatedCard._id;
    const listId = updatedCard.list;

    set({
      lists: get().lists.map(l =>
        l._id === listId
          ? {
              ...l,
              cards: l.cards.map(c => c._id === cardId ? updatedCard : c)
            }
          : l
      )
    });

    if (boardId) {
      socketService.emitCardUpdated(boardId, { cardId, listId, updates: updatedCard });
    }
  },

  moveCard: (cardId, fromListId, toListId, newPosition) => {
    const boardId = get().board?._id;
    const { lists } = get();
    const sourceList = lists.find(l => l._id === fromListId);
    if (!sourceList) return;
    const movedCard = sourceList.cards.find(c => c._id === cardId);
    if (!movedCard) return;

    const updatedLists = lists.map(l => {
      if (fromListId === toListId && l._id === fromListId) {
        const cards = [...l.cards];
        const oldIdx = cards.findIndex(c => c._id === cardId);
        if (oldIdx === -1) return l;
        const [moved] = cards.splice(oldIdx, 1);
        cards.splice(newPosition, 0, moved);
        return { ...l, cards };
      }
      if (l._id === fromListId) {
        return { ...l, cards: l.cards.filter(c => c._id !== cardId) };
      }
      if (l._id === toListId) {
        const cards = [...l.cards];
        cards.splice(newPosition, 0, { ...movedCard, list: toListId });
        return { ...l, cards };
      }
      return l;
    });

    set({ lists: updatedLists });

    axios.put(
      `${API}/card-api/moveCard/${cardId}`,
      { toListId, newPosition },
      { withCredentials: true }
    ).catch(() => {});

    if (boardId) {
      socketService.emitCardMoved(boardId, {
        cardId,
        fromListId,
        toListId,
        newPosition
      });
    }
  }
});
