export default function registerListHandlers(socket) {
  socket.on("list-added", (data) => {
    socket.to(data.boardId).emit("list-added", data);
  });

  socket.on("list-updated", (data) => {
    socket.to(data.boardId).emit("list-updated", data);
  });

  socket.on("list-deleted", (data) => {
    socket.to(data.boardId).emit("list-deleted", data);
  });
}
