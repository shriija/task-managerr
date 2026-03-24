import { io } from "socket.io-client"
import { API_URL } from "../services/api"

let socket = null

export const getSocket = () => socket

export const connectSocket = () => {
  if (socket?.connected) return socket

  socket = io(API_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  })

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id)
  })

  socket.on("disconnect", (reason) => {
    console.log("🔴 Socket disconnected:", reason)
  })

  socket.on("connect_error", (err) => {
    console.log("⚠️ Socket connection error:", err.message)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// ── Board Room Management ─────────────────────────────

export const joinBoard = (boardId, user) => {
  if (!socket?.connected) return
  socket.emit("join-board", {
    boardId,
    user: { _id: user._id, name: user.name, avatar: user.avatar }
  })
}

export const leaveBoard = (boardId) => {
  if (!socket?.connected) return
  socket.emit("leave-board", boardId)
}

// ── Emit events to other clients ──────────────────────

export const emitCardMoved = (boardId, data) => {
  if (!socket?.connected) return
  socket.emit("move-card", { boardId, ...data })
}

export const emitCardAdded = (boardId, data) => {
  if (!socket?.connected) return
  socket.emit("card-added", { boardId, ...data })
}

export const emitCardUpdated = (boardId, data) => {
  if (!socket?.connected) return
  socket.emit("card-updated", { boardId, ...data })
}

export const emitCardDeleted = (boardId, data) => {
  if (!socket?.connected) return
  socket.emit("card-deleted", { boardId, ...data })
}

export const emitListAdded = (boardId, data) => {
  if (!socket?.connected) return
  socket.emit("list-added", { boardId, ...data })
}

export const emitListUpdated = (boardId, data) => {
  if (!socket?.connected) return
  socket.emit("list-updated", { boardId, ...data })
}

export const emitListDeleted = (boardId, data) => {
  if (!socket?.connected) return
  socket.emit("list-deleted", { boardId, ...data })
}
