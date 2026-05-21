# ⚙️ Server — Node.js + Express Backend Documentation

A **Node.js + Express v5** REST API server with **Mongoose v9** ODM, **Socket.IO v4** real-time layer, **JWT HttpOnly cookie** authentication, **bcryptjs** password hashing, and full soft-delete trash management.

---

## 📦 Packages

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web framework and HTTP routing |
| `mongoose` | ^9.3.0 | MongoDB ODM — schemas, models, queries |
| `bcryptjs` | ^3.0.3 | Password hashing and comparison |
| `jsonwebtoken` | ^9.0.3 | JWT generation and verification |
| `cookie-parser` | ^1.4.7 | Parse HttpOnly cookies from requests |
| `cors` | ^2.8.6 | Cross-Origin Resource Sharing middleware |
| `dotenv` | ^16.6.1 | Load environment variables from `.env` |
| `socket.io` | ^4.8.3 | WebSocket server (real-time events) |
| `socket.io-client` | ^4.8.3 | Socket client for server-side testing |
| `date-and-time` | ^4.3.1 | Date formatting and manipulation |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.1.14 | Auto-restart server on file changes |

---

## 🚀 Project Setup — Step by Step

### Step 1 — Initialize the Node.js project

```bash
mkdir server && cd server
npm init -y
```

### Step 2 — Configure ES Modules

Add `"type": "module"` to `package.json` to use `import/export` syntax:

```json
{
  "name": "server",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

### Step 3 — Install all packages

```bash
# Production dependencies
npm install express mongoose bcryptjs jsonwebtoken cookie-parser cors dotenv socket.io socket.io-client date-and-time

# Dev dependency
npm install -D nodemon
```

### Step 4 — Create the environment file

Create `.env` in the `server/` root:

```env
PORT=4001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET_KEY=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit `.env` to version control.** Add it to `.gitignore`.

### Step 5 — Create the directory structure

```bash
mkdir config controllers models Apis sockets utils
touch server.js config/db.js utils/generateToken.js utils/verifyToken.js
```

### Step 6 — Set up MongoDB connection (config/db.js)

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
```

### Step 7 — Create the JWT utility (utils/generateToken.js)

```js
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
};
```

### Step 8 — Create the auth middleware (utils/verifyToken.js)

```js
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized — no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
```

### Step 9 — Build the Express app entry point (server.js)

```js
import exp from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import UserApi from "./Apis/UserApi.js";
import CookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import BoardApp from './Apis/BoardApi.js';
import ListApp from "./Apis/ListApi.js";
import CardApp from "./Apis/CardApi.js";
import boardSocket from "./sockets/boardSocket.js";
import cors from 'cors';

export const app = exp();
config();

// Middlewares
app.use(exp.json());
app.use(CookieParser());
app.use(cors({ origin: true, credentials: true }));

// Routes
app.use("/user-api", UserApi);
app.use("/board-api", BoardApp);
app.use("/list-api", ListApp);
app.use("/card-api", CardApp);

// Connect DB
await connectDB();

// Create HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true }
});

boardSocket(io);

server.listen(process.env.PORT || 4001, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 4001}`)
);
```

### Step 10 — Start the development server

```bash
npm run dev
# Server restarts automatically on file change via Nodemon
# Runs at http://localhost:4001
```

---

## 🗄️ Express Pipeline & Global Middleware

### Middleware Stack (in order of application)

```
Request
  │
  ├─ express.json()        → Parse application/json request bodies
  ├─ CookieParser()        → Parse Cookie header → populate req.cookies
  ├─ cors()                → Set CORS headers (origin: true, credentials: true)
  │
  ├─ Route: /user-api      → UserApi router
  ├─ Route: /board-api     → BoardApp router
  ├─ Route: /list-api      → ListApp router
  └─ Route: /card-api      → CardApp router
```

### `verifyToken` Middleware

Applied to every protected route. Reads the `token` cookie, verifies the JWT signature against `JWT_SECRET_KEY`, and attaches `req.userId` for downstream use.

```
Protected Request
  → verifyToken
      → jwt.verify(token, JWT_SECRET_KEY)
      → req.userId = decoded.id
      → next()   ← passes to controller
```

### Global Error Handling

Express v5 automatically catches async errors. To add a centralized error handler, append after all routes:

```js
// Recommended: add to server.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});
```

---

## 🔐 Authentication — Bcrypt, JWT & HttpOnly Cookies

### Password Hashing (Bcrypt)

On signup, the user's plain-text password is hashed with bcrypt:

```js
// authController.js
const hashedPass = await bcrypt.hash(user.password, 8)
// salt rounds = 8 → ~240ms on modern hardware (safe from brute-force)
```

On login, the submitted password is compared against the stored hash:

```js
const isMatch = await bcrypt.compare(password, user.password)
```

### JWT Generation

After successful login:

```js
const token = generateToken(user)
// Signs: { id: user._id }
// Expires: 1 day
// Secret: process.env.JWT_SECRET_KEY
```

### HttpOnly Cookie

The JWT is sent as a secure, HttpOnly cookie (inaccessible to JavaScript):

```js
res.cookie('token', token, {
  httpOnly: true,           // Blocks JS access (XSS protection)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  secure: false,            // Set true in production (HTTPS only)
  sameSite: "lax"           // CSRF protection
})
```

> In **production** (Render), set `secure: true` and update `sameSite` as needed.

### Logout

```js
res.clearCookie('token', { httpOnly: true, secure: false, sameSite: "lax" })
```

---

## 🗃️ Mongoose Models

All models live in `server/models/`.

### User Model (`User.js`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | String | ✅ | User's display name |
| `email` | String | ✅ | Unique, used for login |
| `password` | String | ✅ | bcrypt hash, never returned in responses |
| `avatar` | String | ❌ | Profile image URL |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

### Board Model (`Board.js`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | ✅ | trim: true, maxLength: 100 |
| `owner` | ObjectId → User | ✅ | Set from JWT on create |
| `members` | [ObjectId → User] | ❌ | Default: [] |
| `admins` | [ObjectId → User] | ❌ | Default: [] |
| `background` | String | ❌ | Hex color, default: `#0052cc` |
| `allowMultipleAssignees` | Boolean | ❌ | Default: false |
| `isDeleted` | Boolean | ❌ | Default: false (soft delete flag) |
| `deletedAt` | Date | ❌ | Timestamp of soft deletion |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

### List Model (`List.js`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | ✅ | List column title |
| `board` | ObjectId → Board | ✅ | Parent board reference |
| `position` | Number | ✅ | Ordering index |
| `isDeleted` | Boolean | ❌ | Default: false |
| `deletedAt` | Date | ❌ | Soft delete timestamp |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

### Card Model (`Card.js`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | ✅ | trim: true, maxLength: 200 |
| `description` | String | ❌ | Default: `""` |
| `list` | ObjectId → List | ✅ | Parent list reference, indexed |
| `assignees` | [ObjectId → User] | ❌ | Multiple assignees |
| `assignedTo` | ObjectId → User | ❌ | Single primary assignee |
| `createdBy` | ObjectId → User | ❌ | User who created the card |
| `status` | String (enum) | ❌ | `"to do"` / `"in progress"` / `"completed"` |
| `attachments` | [Mixed] | ❌ | File attachment objects |
| `dueDate` | Date | ❌ | Default: null |
| `position` | Number | ✅ | Ordering index within list |
| `labels` | [String] | ❌ | Tag labels |
| `priority` | String (enum) | ❌ | `"High"` / `"Medium"` / `"Low"` / `""` |
| `isDeleted` | Boolean | ❌ | Default: false |
| `deletedAt` | Date | ❌ | Soft delete timestamp |
| `createdAt` | Date | auto | Mongoose timestamps |

### InviteToken Model (`InviteToken.js`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `board` | ObjectId → Board | ✅ | Associated board |
| `token` | String | ✅ | Unique JWT-based invite token |
| `expiresAt` | Date | ✅ | Token expiry (TTL index) |
| `createdAt` | Date | auto | Mongoose timestamps |

### Activity Model (`Activity.js`)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `board` | ObjectId → Board | ✅ | Associated board |
| `user` | ObjectId → User | ✅ | User who performed the action |
| `action` | String | ✅ | Action description |
| `createdAt` | Date | auto | Mongoose timestamps |

---

## 🌐 REST API Endpoints

All routes require `verifyToken` middleware unless marked as **public**.

### User API — `/user-api`

| Method | Endpoint | Auth | Payload | Response | Description |
|--------|----------|------|---------|----------|-------------|
| `POST` | `/signup` | ❌ Public | `{ name, email, password }` | `201 { message }` | Register new user |
| `POST` | `/signin` | ❌ Public | `{ email, password }` | `200 { message, payload: user }` + sets cookie | Login |
| `POST` | `/logout` | ❌ Public | — | `200 { message }` + clears cookie | Logout |
| `GET` | `/verify` | ✅ | — | `200 { message, payload: user }` | Validate session |
| `GET` | `/search?q=` | ✅ | Query param `q` | `200 { payload: [users] }` | Search users |

### Board API — `/board-api`

| Method | Endpoint | Roles | Payload | Description |
|--------|----------|-------|---------|-------------|
| `POST` | `/addBoard` | Any authenticated | `{ title, background }` | Create a board |
| `GET` | `/` | Any | — | Get own boards |
| `GET` | `/shared/all` | Any | — | Get shared boards |
| `GET` | `/:id` | Member+ | — | Get single board |
| `PUT` | `/updateBoard/:id` | Owner/Admin | `{ title, allowMultipleAssignees, background }` | Update board settings |
| `DELETE` | `/deleteBoard/:id` | Owner | — | Soft-delete board |
| `GET` | `/trash/deleted` | Any | — | Fetch soft-deleted boards |
| `PUT` | `/restore/:id` | Owner | — | Restore soft-deleted board |
| `DELETE` | `/permanent/:id` | Owner | — | Permanently delete board |
| `PUT` | `/manage-member/:boardId` | Owner | `{ memberId, action }` | `action`: `"promote"` / `"demote"` / `"remove"` |
| `POST` | `/invite/email/:boardId` | Owner/Admin | `{ email }` | Add registered user by email |
| `POST` | `/invite/link/:boardId` | Owner/Admin | — | Generate invite link token |
| `GET` | `/invite/accept/:token` | Authenticated | — | Accept invite & join board |

### List API — `/list-api`

| Method | Endpoint | Roles | Payload | Description |
|--------|----------|-------|---------|-------------|
| `POST` | `/addList` | Owner/Admin | `{ title, board, position }` | Create a list |
| `GET` | `/getLists/:boardId` | Member+ | — | Get all lists for board |
| `GET` | `/getListById/:id` | Member+ | — | Get single list |
| `PUT` | `/updateList/:id` | Owner/Admin | `{ title }` | Rename a list |
| `DELETE` | `/deleteList/:id` | Owner/Admin | — | Soft-delete a list |
| `GET` | `/trash/deleted/:boardId` | Member+ | — | Get deleted lists |
| `PUT` | `/restore/:id` | Owner/Admin | — | Restore a list |
| `DELETE` | `/permanent/:id` | Owner | — | Permanently delete a list |

### Card API — `/card-api`

| Method | Endpoint | Roles | Payload | Description |
|--------|----------|-------|---------|-------------|
| `POST` | `/addCard` | Member+ | `{ title, list, position }` | Create a card |
| `GET` | `/getCards/:listId` | Member+ | — | Get cards for a list |
| `GET` | `/getCardById/:id` | Member+ | — | Get single card |
| `PUT` | `/updateCard/:id` | See note | `{ title, description, dueDate, priority, status, assignedTo, assignees }` | Update card |
| `PUT` | `/moveCard/:id` | Member+ | `{ toListId, newPosition }` | Move card |
| `DELETE` | `/deleteCards/:id` | Owner/Admin | — | Soft-delete a card |
| `GET` | `/trash/deleted/:boardId` | Member+ | — | Get deleted cards |
| `PUT` | `/restore/:id` | Owner/Admin | — | Restore a card |
| `DELETE` | `/permanent/:id` | Owner | — | Permanently delete a card |

> **Card Update Role Filter**: Members can only update `status`. Title, description, dueDate, priority, assignedTo, and assignees require Owner or Admin role. Returns `403 Forbidden` on violation.

---

## 👥 Role-Based Access — Allowed Role Filters

Role is determined by inspecting the board document fetched from MongoDB:

```js
const isOwner  = board.owner.toString() === req.userId
const isAdmin  = board.admins.some(a => a.toString() === req.userId)
const isMember = board.members.some(m => m.toString() === req.userId)
```

| Operation | Owner | Admin | Member |
|-----------|-------|-------|--------|
| View board | ✅ | ✅ | ✅ |
| Add cards | ✅ | ✅ | ✅ |
| Update card status | ✅ | ✅ | ✅ |
| Update card details (title, desc, etc.) | ✅ | ✅ | ❌ |
| Add / rename lists | ✅ | ✅ | ❌ |
| Delete lists/cards (soft) | ✅ | ✅ | ❌ |
| Invite members | ✅ | ✅ | ❌ |
| Manage members (promote/demote/remove) | ✅ | ❌ | ❌ |
| Update board settings | ✅ | ✅ | ❌ |
| Delete board / permanent delete | ✅ | ❌ | ❌ |

---

## 🗑️ Soft Delete System

All entities use a **soft delete** pattern with `isDeleted` and `deletedAt` fields:

### Soft Delete Flow

```
DELETE /board-api/deleteBoard/:id
  → board.isDeleted = true
  → board.deletedAt = new Date()
  → board.save()
  → 200 OK

GET /board-api/trash/deleted
  → BoardModel.find({ owner: req.userId, isDeleted: true })
  → Returns deleted boards

PUT /board-api/restore/:id
  → board.isDeleted = false
  → board.deletedAt = null
  → board.save()

DELETE /board-api/permanent/:id
  → BoardModel.findByIdAndDelete(id)
  → Cascades: deletes all child Lists and Cards
```

### Active Record Filter

All normal queries exclude soft-deleted records:

```js
// Example from ListController
ListModel.find({ board: boardId, isDeleted: false })

// Example from CardController
CardModel.find({ list: listId, isDeleted: false })
```

---

## 🔌 Socket.IO — Real-Time Events

### Server Setup (`sockets/boardSocket.js`)

```js
export default function boardSocket(io) {
  io.on("connection", (socket) => {

    socket.on("join-board", (boardId) => {
      socket.join(boardId)
      // Emit updated online users list to all room members
      const users = [...io.sockets.adapter.rooms.get(boardId) || []]
      io.to(boardId).emit("online-users", users)
    })

    socket.on("leave-board", (boardId) => {
      socket.leave(boardId)
    })

    // Card events — broadcast to all other room members
    socket.on("card-added",   (data) => socket.to(data.boardId).emit("card-added",   data))
    socket.on("card-updated", (data) => socket.to(data.boardId).emit("card-updated", data))
    socket.on("card-deleted", (data) => socket.to(data.boardId).emit("card-deleted", data))
    socket.on("card-moved",   (data) => socket.to(data.boardId).emit("card-moved",   data))

    // List events
    socket.on("list-added",   (data) => socket.to(data.boardId).emit("list-added",   data))
    socket.on("list-updated", (data) => socket.to(data.boardId).emit("list-updated", data))
    socket.on("list-deleted", (data) => socket.to(data.boardId).emit("list-deleted", data))

    socket.on("disconnect", () => {
      // Online users are recalculated per room on disconnect
    })
  })
}
```

---

## 🌐 Multer & Cloudinary (File Uploads)

> Currently configured for future integration. Card `attachments` field is `Schema.Types.Mixed` ready to accept file metadata objects.

To add Multer + Cloudinary upload support:

### Install packages

```bash
npm install multer cloudinary multer-storage-cloudinary
```

### Cloudinary config

```js
// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'task-manager', allowed_formats: ['jpg', 'png', 'pdf'] }
})

export const upload = multer({ storage })
```

### DB Rollback Strategy on Upload Failure

```js
// In card controller — attach file metadata only after successful Cloudinary upload
try {
  const result = await cloudinary.uploader.upload(file.path)
  card.attachments.push({ url: result.secure_url, public_id: result.public_id })
  await card.save()
} catch (err) {
  // Rollback: delete from Cloudinary if DB save fails
  if (result?.public_id) await cloudinary.uploader.destroy(result.public_id)
  res.status(500).json({ message: "Upload failed — rolled back" })
}
```

### Required `.env` additions for Cloudinary

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚙️ Environment Parameters

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ❌ | Server port (default: `4001`) |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET_KEY` | ✅ | Secret used to sign/verify JWTs |
| `CLIENT_URL` | ❌ | Frontend URL for CORS (default: `true` = all origins) |
| `CLOUDINARY_CLOUD_NAME` | ❌ | Cloudinary cloud name (file uploads) |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key (file uploads) |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret (file uploads) |

---

## 🛠️ Nodemon Dev Server

Nodemon watches all `.js` files and restarts the server on save:

```bash
npm run dev
# Equivalent to: nodemon server.js
```

Nodemon configuration can be added to `package.json` or `nodemon.json`:

```json
// nodemon.json (optional)
{
  "watch": ["server.js", "controllers", "models", "Apis", "sockets", "utils", "config"],
  "ext": "js",
  "ignore": ["node_modules"]
}
```

---

## 🚀 Render Deployment

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

### Step 2 — Create a new Web Service on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repository
3. Set the **Root Directory** to `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start` (runs `node server.js`)

### Step 3 — Add Environment Variables on Render

In the Render dashboard → **Environment** tab, add:

| Key | Value |
|-----|-------|
| `PORT` | `4001` (Render overrides this automatically) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET_KEY` | Your production JWT secret |
| `CLIENT_URL` | Your deployed frontend URL |

### Step 4 — Update CORS for production

```js
// server.js — production CORS config
app.use(cors({
  origin: process.env.CLIENT_URL,  // specific frontend URL
  credentials: true
}))
```

### Step 5 — Update cookie settings for production

```js
// authController.js — production cookie flags
res.cookie('token', token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: true,        // ← HTTPS only in production
  sameSite: "none"     // ← Required for cross-site cookies
})
```

---

## 📜 Available Scripts

```bash
npm run dev     # Start with Nodemon (auto-restart) — development
npm start       # Start with Node — production
```
