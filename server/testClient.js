import { io } from "socket.io-client";

const socket = io("http://localhost:4001");

socket.on("connect", () => {
  console.log("Connected as:", socket.id);

  // Join board
  socket.emit("join-board", {
    boardId: "board123",
    user: { name: "Test User" }
  });

  // Simulate card move
  setTimeout(() => {
    socket.emit("move-card", {
      boardId: "board123",
      cardId: "card1",
      fromListId: "todo",
      toListId: "done",
      newIndex: 0
    });
  }, 2000);
});

socket.on("online-users", (users) => {
  console.log("Online users:", users);
});

socket.on("card-moved", (data) => {
  console.log("Card moved received:", data);
});