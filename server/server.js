import exp from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import UserApi from "./Apis/UserApi.js";
import CookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import BoardApp from './Apis/BoardApi.js'
import ListApp from "./Apis/ListApi.js";
import CardApp from "./Apis/CardApi.js";
import boardSocket from "./sockets/boardSocket.js";
import cors from 'cors'
export const app = exp();

config();

// Middlewares
app.use(exp.json());
app.use(CookieParser());

const FRONTEND_URL = "http://localhost:5173" || "http://localhost:5174";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);

// Routes
app.use("/user-api", UserApi);
app.use("/board-api",BoardApp);
app.use("/list-api",ListApp)
app.use("/card-api",CardApp)
// Connect DB
await connectDB();

// 🔹 Create HTTP server (needed for Socket.io)
const server = http.createServer(app);


// 🔹 Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, // change later to frontend URL
    credentials: true
  },
});

// 🔹 Attach your socket logic
boardSocket(io);

// 🔹 Start server
server.listen(process.env.PORT || 4001, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 4001}`);
});