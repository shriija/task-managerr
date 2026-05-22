import axios from "axios";
import { API_URL as API } from "../../services/api";
import * as socketService from "../../socket/socketService";

export const createBoardSlice = (set, get) => ({
  board: null,
  loading: false,
  error: null,

  fetchBoard: async (boardId) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API}/board-api/${boardId}`, { withCredentials: true });
      const board = res.data.payload;

      let lists = [];
      try {
        const listRes = await axios.get(`${API}/list-api/getLists/${boardId}`, { withCredentials: true });
        lists = listRes.data?.payload || [];
      } catch {
        lists = [];
      }

      const listsWithCards = await Promise.all(
        lists.map(async (list) => {
          try {
            const cardRes = await axios.get(`${API}/card-api/getCards/${list._id}`, { withCredentials: true });
            return { ...list, cards: cardRes.data?.payload || [] };
          } catch {
            return { ...list, cards: [] };
          }
        })
      );

      set({ board, lists: listsWithCards, loading: false });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "Failed to load board" });
    }
  },

  reset: () => {
    const boardId = get().board?._id;
    if (boardId) socketService.leaveBoard(boardId);
    set({ board: null, lists: [], loading: false, error: null, onlineUsers: [] });
  }
});
