import axios from "axios";
import { API_URL as API } from "../../services/api";

export const createTrashSlice = (set, get) => ({
  deletedBoards: [],
  deletedLists: [],
  deletedCards: [],

  fetchDeletedBoards: async () => {
    try {
      const res = await axios.get(`${API}/board-api/trash/deleted`, { withCredentials: true });
      set({ deletedBoards: res.data.payload || [] });
    } catch (err) { console.error(err); }
  },

  restoreBoard: async (boardId) => {
    try {
      await axios.put(`${API}/board-api/restore/${boardId}`, {}, { withCredentials: true });
      set(state => ({ deletedBoards: state.deletedBoards.filter(b => b._id !== boardId) }));
    } catch (err) { console.error(err); }
  },

  permanentDeleteBoard: async (boardId) => {
    try {
      await axios.delete(`${API}/board-api/permanent/${boardId}`, { withCredentials: true });
      set(state => ({ deletedBoards: state.deletedBoards.filter(b => b._id !== boardId) }));
    } catch (err) { console.error(err); }
  },

  fetchDeletedListsAndCards: async (boardId) => {
    try {
      const [listsRes, cardsRes] = await Promise.all([
        axios.get(`${API}/list-api/trash/deleted/${boardId}`, { withCredentials: true }),
        axios.get(`${API}/card-api/trash/deleted/${boardId}`, { withCredentials: true })
      ]);
      set({
        deletedLists: listsRes.data.payload || [],
        deletedCards: cardsRes.data.payload || []
      });
    } catch (err) { console.error(err); }
  },

  restoreList: async (listId, boardId) => {
    try {
      await axios.put(`${API}/list-api/restore/${listId}`, {}, { withCredentials: true });
      get().fetchDeletedListsAndCards(boardId);
      get().fetchBoard(boardId);
    } catch (err) { console.error(err); }
  },

  permanentDeleteList: async (listId) => {
    try {
      await axios.delete(`${API}/list-api/permanent/${listId}`, { withCredentials: true });
      set(state => ({ deletedLists: state.deletedLists.filter(l => l._id !== listId) }));
    } catch (err) { console.error(err); }
  },

  restoreCard: async (cardId, boardId) => {
    try {
      await axios.put(`${API}/card-api/restore/${cardId}`, {}, { withCredentials: true });
      get().fetchDeletedListsAndCards(boardId);
      get().fetchBoard(boardId);
    } catch (err) { console.error(err); }
  },

  permanentDeleteCard: async (cardId) => {
    try {
      await axios.delete(`${API}/card-api/permanent/${cardId}`, { withCredentials: true });
      set(state => ({ deletedCards: state.deletedCards.filter(c => c._id !== cardId) }));
    } catch (err) { console.error(err); }
  }
});
