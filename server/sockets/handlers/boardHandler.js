export default function registerBoardHandlers(socket) {
  socket.on("board-updated", (data) => {
    socket.to(data.boardId).emit("board-updated", data);
  });

  socket.on("member-updated", (data) => {
    socket.to(data.boardId).emit("member-updated", data);
  });
}
