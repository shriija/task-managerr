import axios from "axios";
import { API_URL as API } from "../../services/api";
import * as socketService from "../../socket/socketService";

export const createCollaborationSlice = (set, get) => ({
  onlineUsers: [],
  activities: [],

  updateBoardSettings: async (boardId, updates) => {
    try {
      const res = await axios.put(
        `${API}/board-api/updateBoard/${boardId}`,
        updates,
        { withCredentials: true }
      );
      set({ board: res.data.payload });
      socketService.emitBoardUpdated(boardId, {
        board: res.data.payload
      });
    } catch (err) { console.error(err); }
  },

  manageBoardMember: async (boardId, memberId, action) => {
    try {
      const res = await axios.put(
        `${API}/board-api/manage-member/${boardId}`,
        { memberId, action },
        { withCredentials: true }
      );
      set({ board: res.data.payload });
      socketService.emitMemberUpdated(boardId, {
        board: res.data.payload
      });
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  inviteByEmail: async (boardId, email) => {
    const res = await axios.post(
      `${API}/board-api/invite/email/${boardId}`,
      { email },
      { withCredentials: true }
    );
    set({ board: res.data.payload });
    socketService.emitMemberUpdated(boardId, {
      board: res.data.payload
    });
    return res.data;
  },

  generateInviteLink: async (boardId) => {
    const res = await axios.post(
      `${API}/board-api/invite/link/${boardId}`,
      {},
      { withCredentials: true }
    );
    return res.data.payload;
  },

  fetchActivities: async (boardId) => {
    try {
      const res = await axios.get(`${API}/board-api/activity/${boardId}`, { withCredentials: true });
      set({ activities: res.data.payload || [] });
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    }
  }
});
