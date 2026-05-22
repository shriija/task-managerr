export default function registerCardHandlers(socket) {
  socket.on("move-card", (data) => {
    socket.to(data.boardId).emit("card-moved", data);
  });

  socket.on("card-added", (data) => {
    socket.to(data.boardId).emit("card-added", data);
  });

  socket.on("card-updated", (data) => {
    socket.to(data.boardId).emit("card-updated", data);
  });

  socket.on("card-deleted", (data) => {
    socket.to(data.boardId).emit("card-deleted", data);
  });
}
