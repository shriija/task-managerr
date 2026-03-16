// Store online users per board
const onlineUsers = {};

export default function boardSocket(io) {

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

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

      console.log(`${user.name} joined board ${boardId}`);
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

      console.log("🔴 User disconnected:", socket.id);
    });

    // ===============================
// CARD MOVED (Drag & Drop Sync)
// ===============================
socket.on("move-card", (data) => {
  const { boardId } = data;

  // Send update to others in same board
  socket.to(boardId).emit("card-moved", data);

  console.log("Card moved on board:", boardId);
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


