import exp from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import UserApi from "./Apis/UserApi.js";
import CookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import BoardApp from './Apis/BoardApi.js'
import boardSocket from "./sockets/boardSocket.js";
import cors from 'cors'
export const app = exp();

config();

// Middlewares
app.use(exp.json());
app.use(CookieParser());
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// Routes
app.use("/user-api", UserApi);
app.use("/board-api",BoardApp)
// Connect DB
await connectDB();

// 🔹 Create HTTP server (needed for Socket.io)
const server = http.createServer(app);

// 🔹 Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/", // change later to frontend URL
  },
});

// 🔹 Attach your socket logic
boardSocket(io);

// 🔹 Start server
server.listen(process.env.PORT || 4001, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 4001}`);
});