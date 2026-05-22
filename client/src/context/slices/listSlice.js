import axios from "axios";
import { API_URL as API } from "../../services/api";
import * as socketService from "../../socket/socketService";

export const createListSlice = (set, get) => ({
  lists: [],

  addList: async (boardId, title) => {
    const { lists } = get();
    const position = lists.length;
    const tempList = { _id: `temp-${Date.now()}`, title, board: boardId, position, cards: [] };

    set({ lists: [...lists, tempList] });

    try {
      const res = await axios.post(`${API}/list-api/addList`, { title, board: boardId, position }, { withCredentials: true });
      const saved = res.data.payload;
      set({
        lists: get().lists.map(l => l._id === tempList._id ? { ...saved, cards: [] } : l)
      });
      socketService.emitListAdded(boardId, { list: saved });
    } catch {
      set({ lists: get().lists.filter(l => l._id !== tempList._id) });
    }
  },

  updateListTitle: (listId, newTitle) => {
    const boardId = get().board?._id;
    set({
      lists: get().lists.map(l => l._id === listId ? { ...l, title: newTitle } : l)
    });
    axios.put(`${API}/list-api/updateList/${listId}`, { title: newTitle }, { withCredentials: true }).catch(() => {});
    if (boardId) socketService.emitListUpdated(boardId, { listId, title: newTitle });
  },

  deleteList: (listId) => {
    const boardId = get().board?._id;
    set({ lists: get().lists.filter(l => l._id !== listId) });
    axios.delete(`${API}/list-api/deleteList/${listId}`, { withCredentials: true }).catch(() => {});
    if (boardId) socketService.emitListDeleted(boardId, { listId });
  }
});
