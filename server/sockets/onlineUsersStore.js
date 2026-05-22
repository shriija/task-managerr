export const onlineUsers = {};

export function removeUser(boardId, socketId, io) {
  if (!onlineUsers[boardId]) return;

  onlineUsers[boardId] = onlineUsers[boardId].filter(
    (u) => u.socketId !== socketId
  );

  io.to(boardId).emit("online-users", onlineUsers[boardId]);
}
