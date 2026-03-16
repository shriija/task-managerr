import exp from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import boardSocket from "./sockets/boardSocket.js"; 

export const app = exp();

config();
app.use(exp.json());

// Connect database
await connectDB();

// 🔹 Create HTTP server
const server = http.createServer(app);

// 🔹 Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

// 🔹 Attach your socket logic
boardSocket(io);

// 🔹 Start server
server.listen(process.env.PORT || 4001, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 4001}`);
});