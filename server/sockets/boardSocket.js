// Store online users per board
const onlineUsers = {};

export default function boardSocket(io) {

  io.on("connection", (socket) => {
    // Track boards joined by this socket
    socket.joinedBoards = new Set();

    // ===============================
    // JOIN BOARD (with user info)
    // ===============================
    socket.on("join-board", ({ boardId, user }) => {

      socket.join(boardId);
      socket.joinedBoards.add(boardId);

      if (!onlineUsers[boardId]) {
        onlineUsers[boardId] = [];
      }

      // ❌ Prevent duplicate entry
      const alreadyExists = onlineUsers[boardId].some(
        (u) => u.socketId === socket.id
      );

      if (!alreadyExists) {
        onlineUsers[boardId].push({
          socketId: socket.id,
          user,
        });
      }

      // Send updated list
      io.to(boardId).emit("online-users", onlineUsers[boardId]);
    });

    // ===============================
    // LEAVE BOARD
    // ===============================
    socket.on("leave-board", (boardId) => {
      removeUser(boardId, socket.id, io);
      socket.leave(boardId);
      socket.joinedBoards.delete(boardId);
    });

    // ===============================
    // DISCONNECT
    // ===============================
    socket.on("disconnect", () => {

      // Remove from all joined boards
      for (const boardId of socket.joinedBoards) {
        removeUser(boardId, socket.id, io);
      }
    });

    // ===============================
    // CARD EVENTS
    // ===============================
    socket.on("move-card", (data) => {
      const { boardId } = data;
      socket.to(boardId).emit("card-moved", data);
    });

    socket.on("card-added", (data) => {
      const { boardId } = data;
      socket.to(boardId).emit("card-added", data);
    });

    socket.on("card-updated", (data) => {
      const { boardId } = data;
      socket.to(boardId).emit("card-updated", data);
    });

    socket.on("card-deleted", (data) => {
      const { boardId } = data;
      socket.to(boardId).emit("card-deleted", data);
    });

    // ===============================
    // LIST EVENTS
    // ===============================
    socket.on("list-added", (data) => {
      const { boardId } = data;
      socket.to(boardId).emit("list-added", data);
    });

    socket.on("list-updated", (data) => {
      const { boardId } = data;
      socket.to(boardId).emit("list-updated", data);
    });

    socket.on("list-deleted", (data) => {
      const { boardId } = data;
      socket.to(boardId).emit("list-deleted", data);
    });

  });
}


// ===============================
// Helper: Remove user
// ===============================
function removeUser(boardId, socketId, io) {
  if (!onlineUsers[boardId]) return;

  onlineUsers[boardId] = onlineUsers[boardId].filter(
    (u) => u.socketId !== socketId
  );

  io.to(boardId).emit("online-users", onlineUsers[boardId]);
}


