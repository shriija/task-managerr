import { io } from "socket.io-client";
import { API_URL } from "../services/api";

// Singleton instance of the socket connection
let socket = null;

/**
 * Get the current socket instance.
 * @returns {Socket|null} The active socket connection or null if not connected.
 */
export const getSocket = () => socket;

/**
 * Initialize and connect the Socket.io client.
 * Connects to the backend API_URL and configures reconnect behavior.
 * Uses HTTP-only cookies (withCredentials: true) to authenticate the handshake if implemented.
 * 
 * @returns {Socket} The active socket connection.
 */
export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(API_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"], // Try websocket first, fallback to polling
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  });

  // Basic connection lifecycle events (can be expanded for debugging)
  socket.on("connect", () => {});
  socket.on("disconnect", (reason) => {});
  socket.on("connect_error", (err) => {});

  return socket;
};

/**
 * Disconnect the socket and cleanup the singleton instance.
 * Used when a user logs out to prevent hanging connections.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ── Board Room Management ─────────────────────────────
// Socket.io "Rooms" are used to broadcast events ONLY to users currently viewing the same board.

/**
 * Join a specific board's Socket room.
 * Called by the frontend Board layout component when a user navigates to a board.
 * 
 * @param {string} boardId - The ID of the board to join
 * @param {Object} user - The current user details (used to show "active users" on the board)
 */
export const joinBoard = (boardId, user) => {
  if (!socket?.connected) return;
  socket.emit("join-board", {
    boardId,
    user: { _id: user._id, name: user.name, avatar: user.avatar }
  });
};

/**
 * Leave a specific board's Socket room.
 * Called when the user navigates away from the board or unmounts the component.
 * 
 * @param {string} boardId - The ID of the board to leave
 */
export const leaveBoard = (boardId) => {
  if (!socket?.connected) return;
  socket.emit("leave-board", boardId);
};

// ── Emit events to other clients ──────────────────────
// These functions are called by the frontend AFTER successfully modifying data via the REST API.
// They broadcast the new state to all OTHER clients in the same board room.

/** Broadcast that a card was dragged/moved to a new position or list */
export const emitCardMoved = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("move-card", { boardId, ...data });
};

/** Broadcast that a new card was created */
export const emitCardAdded = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("card-added", { boardId, ...data });
};

/** 
 * Broadcast that a card's details were updated.
 * Also used to sync remarks, attachments, and assignments since they are part of the card document.
 */
export const emitCardUpdated = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("card-updated", { boardId, ...data });
};

/** Broadcast that a card was soft-deleted */
export const emitCardDeleted = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("card-deleted", { boardId, ...data });
};

/** Broadcast that a new list was created */
export const emitListAdded = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("list-added", { boardId, ...data });
};

/** Broadcast that a list was updated (e.g., renamed) */
export const emitListUpdated = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("list-updated", { boardId, ...data });
};

/** Broadcast that a list was soft-deleted */
export const emitListDeleted = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("list-deleted", { boardId, ...data });
};

/** Broadcast that the board's settings (title, background) changed */
export const emitBoardUpdated = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("board-updated", { boardId, ...data });
};

/** Broadcast that board membership changed (member added, removed, promoted) */
export const emitMemberUpdated = (boardId, data) => {
  if (!socket?.connected) return;
  socket.emit("member-updated", { boardId, ...data });
};