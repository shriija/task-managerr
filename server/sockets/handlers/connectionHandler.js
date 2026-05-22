import { onlineUsers, removeUser } from '../onlineUsersStore.js';

export default function registerConnectionHandlers(socket, io) {
  socket.on("join-board", ({ boardId, user }) => {
    socket.join(boardId);
    socket.joinedBoards.add(boardId);

    if (!onlineUsers[boardId]) {
      onlineUsers[boardId] = [];
    }

    const alreadyExists = onlineUsers[boardId].some(
      (u) => u.socketId === socket.id
    );

    if (!alreadyExists) {
      onlineUsers[boardId].push({
        socketId: socket.id,
        user
      });
    }

    io.to(boardId).emit("online-users", onlineUsers[boardId]);
  });

  socket.on("leave-board", (boardId) => {
    removeUser(boardId, socket.id, io);
    socket.leave(boardId);
    socket.joinedBoards.delete(boardId);
  });

  socket.on("disconnect", () => {
    for (const boardId of socket.joinedBoards) {
      removeUser(boardId, socket.id, io);
    }
  });
}
