# 🖥️ Server — Express + MongoDB Backend

This directory contains the full backend API for the Task Manager project. It is built with **Express 5**, **Mongoose 9**, **Socket.io 4**, and uses **bcryptjs** for password security, **jsonwebtoken** for session management via HttpOnly cookies, **Multer** for file parsing, and **Cloudinary** for cloud storage.

---

## 📦 Packages & Dependencies

### Production Dependencies

| Package | Version | Role |
|---|---|---|
| `express` | ^5.2.1 | Web framework (HTTP server, routing, middleware pipeline) |
| `mongoose` | ^9.3.0 | MongoDB ODM — schema definitions, models, and querying |
| `bcryptjs` | ^3.0.3 | Password hashing and comparison (pure-JS, no native bindings) |
| `jsonwebtoken` | ^9.0.3 | JWT signing and verification for session management |
| `cookie-parser` | ^1.4.7 | Parses `Cookie` header; makes cookies available on `req.cookies` |
| `cors` | ^2.8.6 | Cross-Origin Resource Sharing — restricts origin to `CLIENT_URL` |
| `dotenv` | ^16.6.1 | Loads environment variables from `.env` into `process.env` |
| `socket.io` | ^4.8.3 | Real-time bidirectional WebSocket server |
| `socket.io-client` | ^4.8.3 | Used server-side for any inter-process socket needs |
| `multer` | ^2.1.1 | `multipart/form-data` parsing (memory storage → Cloudinary) |
| `cloudinary` | ^2.10.0 | Cloudinary Node.js SDK for image/file upload and deletion |
| `google-auth-library` | ^10.6.2 | Verifies Google OAuth 2.0 ID tokens server-side |
| `date-and-time` | ^4.3.1 | Lightweight date formatting for activity logs |

### Dev Dependencies

| Package | Version | Role |
|---|---|---|
| `nodemon` | ^3.1.14 | Watches for file changes and auto-restarts the server in development |

---

## 🗂️ Directory Structure

```
server/
├── Apis/                        # Express Router definitions
│   ├── UserApi.js               # /user-api — auth & profile routes
│   ├── BoardApi.js              # /board-api — board CRUD + invite + trash
│   ├── ListApi.js               # /list-api — list CRUD + trash
│   └── CardApi.js               # /card-api — card CRUD + attachments + remarks + trash
│
├── config/                      # Third-party service configuration
│   ├── db.js                    # Mongoose connection (process.exit(1) on failure)
│   └── cloudinary.js            # Cloudinary SDK initialization
│
├── controllers/                 # Business logic per resource
│   ├── authController.js        # Signup, signin, Google OAuth, profile, password
│   ├── boardController.js       # Board CRUD, members, activity, trash
│   ├── ListController.js        # List CRUD and trash
│   ├── cardController.js        # Card CRUD, move, attachments, remarks, trash
│   └── inviteController.js      # Invite by email and generate/accept invite link
│
├── models/                      # Mongoose schema definitions
│   ├── User.js                  # UserSchema (name, email, password, avatar, isGoogleUser)
│   ├── Board.js                 # BoardSchema (title, owner, members, admins, background, soft-delete)
│   ├── List.js                  # ListSchema (title, board ref, position, soft-delete)
│   ├── Card.js                  # CardSchema (title, desc, list, assignees, status, attachments, remarks, soft-delete)
│   ├── Activity.js              # ActivitySchema (board, actor, action, target, timestamp)
│   └── InviteToken.js           # InviteTokenSchema (board, token, email, expiry, used flag)
│
├── sockets/
│   └── boardSocket.js           # Socket.io event handlers (join/leave room, card/list/board events)
│
├── utils/
│   ├── generateToken.js         # JWT signing (1d expiry)
│   ├── verifyToken.js           # Express middleware — verifies HttpOnly cookie JWT
│   ├── upload.js                # Multer configurations (avatar 5MB, files 10MB × 5)
│   └── activityLogger.js        # Helper to write Activity documents
│
├── server.js                    # App entry: Express + CORS + Socket.io + DB connection
├── package.json
└── envexample.txt               # Environment variable template
```

---

## 🚀 Express Pipeline

The request lifecycle for every API call:

```
Incoming HTTP Request
        │
        ▼
  app.set("trust proxy", 1)          ← Required for HttpOnly cookies behind a reverse proxy (Render)
        │
        ▼
  express.json()                     ← Parses JSON request bodies
        │
        ▼
  CookieParser()                     ← Populates req.cookies from Cookie header
        │
        ▼
  cors({ origin: CLIENT_URL,         ← Allows only the configured frontend origin
         credentials: true })        ← Required for cross-origin cookie sending
        │
        ▼
  Router (UserApi / BoardApi / ...)  ← Matches method + path
        │
        ▼
  verifyToken (protected routes)     ← Validates JWT; attaches req.userId
        │
        ▼
  [Multer middleware] (upload routes) ← Parses multipart; stores files in memory Buffer
        │
        ▼
  Controller Function                ← Business logic, DB queries, Cloudinary calls
        │
        ▼
  res.json({ ... })                  ← JSON response sent back to client
```

### Global Error Handling

Express 5 forwards async errors to the default error handler automatically (no need for `try/catch` wrapping in every route if you use `async` handlers). All controllers use explicit `try/catch` blocks for granular error messages:

```js
// Pattern used in all controllers:
try {
  // ... business logic
} catch (err) {
  res.status(500).json({ error: err.message });
}
```

---

## 🗃️ Mongoose Models

### `User` (`models/User.js`)

| Field | Type | Constraints | Description |
|---|---|---|---|
| `name` | String | required, minlength: 2, trim | User's display name |
| `email` | String | required, unique, lowercase | Login identifier |
| `password` | String | required, minlength: 6 | bcrypt hash |
| `avatar` | String | default: `""` | Cloudinary URL |
| `isGoogleUser` | Boolean | default: `false` | Whether registered via Google |
| `hasPasswordSet` | Boolean | default: `true` | Google users can set a password later |
| `createdAt` | Date | auto | Mongoose timestamps |
| `updatedAt` | Date | auto | Mongoose timestamps |

### `Board` (`models/Board.js`)

| Field | Type | Description |
|---|---|---|
| `title` | String | Board display name (max 100 chars) |
| `owner` | ObjectId → User | Creator / current owner |
| `members` | [ObjectId] → User | Standard members |
| `admins` | [ObjectId] → User | Elevated privilege users |
| `background` | String | Hex color or image URL (default `#0052cc`) |
| `isDeleted` | Boolean | Soft-delete flag |
| `deletedAt` | Date | When board was trashed |
| `allowMultipleAssignees` | Boolean | Board-level card assignment mode |

### `List` (`models/List.js`)

| Field | Type | Description |
|---|---|---|
| `title` | String | Column heading |
| `board` | ObjectId → Board | Parent board reference |
| `position` | Number | Horizontal sort order |
| `isDeleted` | Boolean | Soft-delete flag |
| `deletedAt` | Date | When list was trashed |

### `Card` (`models/Card.js`)

| Field | Type | Description |
|---|---|---|
| `title` | String | Task title (max 200 chars) |
| `description` | String | Task details |
| `list` | ObjectId → List | Parent list reference (indexed) |
| `assignees` | [ObjectId] → User | Multi-assignee array |
| `assignedTo` | ObjectId → User | Single assignee |
| `createdBy` | ObjectId → User | Card creator |
| `status` | Enum | `"to do"` / `"in progress"` / `"completed"` |
| `attachments` | [AttachmentSchema] | Direct file attachments |
| `remarks` | [RemarkSchema] | Comments with optional attachments |
| `dueDate` | Date | Task deadline |
| `position` | Number | Vertical sort order within list |
| `labels` | [String] | Tag array |
| `priority` | Enum | `"High"` / `"Medium"` / `"Low"` / `""` |
| `isDeleted` | Boolean | Soft-delete flag |
| `deletedAt` | Date | When card was trashed |

**Sub-schemas embedded in Card:**

`AttachmentSchema`: `{ name, url, type, size, publicId, uploadedBy, uploadedAt }`  
`RemarkSchema`: `{ text, attachments: [AttachmentSchema], author }` + timestamps

### `Activity` (`models/Activity.js`)

Tracks all board-level actions for the activity feed.

| Field | Description |
|---|---|
| `board` | ObjectId → Board |
| `actor` | ObjectId → User |
| `action` | String description of the action |
| `target` | String (card/list name affected) |
| `createdAt` | Auto timestamp |

### `InviteToken` (`models/InviteToken.js`)

Manages invite links.

| Field | Description |
|---|---|
| `board` | ObjectId → Board |
| `token` | Unique random token string |
| `email` | Recipient email (for email invites) |
| `expiresAt` | Token expiry date |
| `used` | Boolean — prevents replay |

---

## 🔐 Password Hashing (bcryptjs) & JWT (HttpOnly Cookies)

### Password Hashing Flow

```js
// In authController.js — Signup:
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
// Stored in User.password — original password is never persisted

// Signin:
const isMatch = await bcrypt.compare(plainPassword, user.password);
// Returns boolean — rejects if false
```

### JWT Generation (`utils/generateToken.js`)

```js
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },             // Payload: only the user's MongoDB _id
    process.env.JWT_SECRET_KEY,   // Secret from environment
    { expiresIn: "1d" }           // Token expires in 24 hours
  );
};
```

### Setting the HttpOnly Cookie (in `authController.js`)

```js
const token = generateToken(user);

res.cookie("token", token, {
  httpOnly: true,       // JS cannot read this cookie — prevents XSS
  secure: true,         // Only sent over HTTPS in production
  sameSite: "none",     // Required for cross-origin requests (frontend ↔ backend on different domains)
  maxAge: 24 * 60 * 60 * 1000  // 1 day in ms
});

res.json({ message: "Login successful", payload: user });
```

### Token Verification Middleware (`utils/verifyToken.js`)

```js
const verifyToken = (req, res, next) => {
  const { token } = req.cookies;           // cookie-parser populates req.cookies
  if (!token) return res.status(401).json({ message: "No Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;               // Injected into req for controllers
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

---

## 🛣️ REST API Endpoints, Role Filters & Payload Variables

### User API (`/user-api`)

| Method | Path | Middleware | Auth Required | Key Payload |
|---|---|---|---|---|
| `POST` | `/signup` | — | ✗ | `{ name, email, password }` |
| `POST` | `/signin` | — | ✗ | `{ email, password }` |
| `POST` | `/google-signin` | — | ✗ | `{ token: googleCredentialToken }` |
| `POST` | `/logout` | — | ✗ | — (clears cookie) |
| `GET` | `/verify` | `verifyToken` | ✓ | — |
| `GET` | `/search?q=` | `verifyToken` | ✓ | Query param `q` |
| `PUT` | `/profile` | `verifyToken` | ✓ | `{ name }` |
| `PUT` | `/change-password` | `verifyToken` | ✓ | `{ oldPassword, newPassword }` OR `{ googleToken, newPassword }` |
| `POST` | `/upload-avatar` | `uploadAvatarMiddleware` | ✗ | `FormData: { avatar: File }` |

### Board API (`/board-api`)

**Role filter logic** (enforced in `boardController.js`):
- **Create board**: Any authenticated user
- **View board**: Owner, Admin, or Member
- **Update board**: Owner or Admin only
- **Delete board** (soft): Owner only
- **Manage members**: Owner or Admin
- **Permanent delete**: Owner only

| Method | Path | Role Required | Key Payload |
|---|---|---|---|
| `POST` | `/addBoard` | Authenticated | `{ title, background? }` |
| `GET` | `/` | Authenticated | — |
| `GET` | `/shared/all` | Authenticated | — |
| `GET` | `/:id` | Member+ | — |
| `PUT` | `/updateBoard/:id` | Admin+ | `{ title?, background?, allowMultipleAssignees? }` |
| `DELETE` | `/deleteBoard/:id` | Owner | — |
| `GET` | `/trash/deleted` | Authenticated | — |
| `PUT` | `/restore/:id` | Owner | — |
| `DELETE` | `/permanent/:id` | Owner | — |
| `PUT` | `/manage-member/:boardId` | Admin+ | `{ userId, action: "add"/"remove"/"promote"/"demote" }` |
| `GET` | `/activity/:boardId` | Member+ | — |
| `POST` | `/invite/email/:boardId` | Admin+ | `{ email }` |
| `POST` | `/invite/link/:boardId` | Admin+ | — |
| `GET` | `/invite/accept/:token` | Authenticated | — |

### List API (`/list-api`)

All list routes require `verifyToken`. Board membership is validated in the controller.

| Method | Path | Key Payload |
|---|---|---|
| `POST` | `/addList` | `{ title, boardId, position }` |
| `GET` | `/getLists/:boardId` | — |
| `GET` | `/getListById/:id` | — |
| `PUT` | `/updateList/:id` | `{ title? }` |
| `DELETE` | `/deleteList/:id` | — |
| `GET` | `/trash/deleted/:boardId` | — |
| `PUT` | `/restore/:id` | — |
| `DELETE` | `/permanent/:id` | — |

### Card API (`/card-api`)

All card routes require `verifyToken`.

| Method | Path | Middleware | Key Payload |
|---|---|---|---|
| `POST` | `/addCard` | — | `{ title, listId, boardId, position }` |
| `GET` | `/getCards/:id` | — | `:id` = listId |
| `GET` | `/getCardById/:id` | — | — |
| `PUT` | `/updateCard/:id` | — | `{ title?, description?, status?, priority?, labels?, dueDate?, assignees?, assignedTo? }` |
| `PUT` | `/moveCard/:id` | — | `{ listId, position, boardId }` |
| `DELETE` | `/deleteCards/:id` | — | — |
| `GET` | `/trash/deleted/:boardId` | — | — |
| `PUT` | `/restore/:id` | — | — |
| `DELETE` | `/permanent/:id` | — | — |
| `POST` | `/attachments/:cardId` | `uploadFiles` | `FormData: { files: File[] }` |
| `DELETE` | `/attachments/:cardId/:attachmentId` | — | — |
| `POST` | `/remarks/:cardId` | `uploadFiles` | `FormData: { text?, files?: File[] }` |
| `DELETE` | `/remarks/:cardId/:remarkId` | — | — |

---

## 📁 Multer Config, Cloudinary Uploads & DB Rollback Strategies

### Multer Configuration (`utils/upload.js`)

```js
// Memory storage — files held in RAM as Buffer objects, never written to disk
const storage = multer.memoryStorage();

// Avatar upload: single image, 5 MB limit
export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,          // Only image/* MIME types accepted
  limits: { fileSize: 5 * 1024 * 1024 }  // 5 MB
}).single("avatar");

// General file upload: up to 5 files, 10 MB each
export const uploadFiles = multer({
  storage,
  fileFilter: generalFilter,        // Images, PDF, Word, Excel, PowerPoint, TXT, CSV, ZIP, RAR
  limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB per file
}).array("files", 5);
```

**Accepted MIME types for general uploads:**
- Images: `image/*`
- Documents: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Spreadsheets: `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Presentations: `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`
- Text: `text/plain`, `text/csv`
- Archives: `application/zip`, `application/x-rar-compressed`

### Cloudinary Upload Flow (`config/cloudinary.js`)

```js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

**Upload pattern used in controllers:**
```js
// Stream a Buffer (from multer.memoryStorage) directly to Cloudinary:
const result = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: "task-manager/attachments", resource_type: "auto" },
    (error, result) => error ? reject(error) : resolve(result)
  );
  stream.end(file.buffer);  // file.buffer is the in-memory multer Buffer
});

// result.secure_url  → stored in DB
// result.public_id   → stored in DB for later deletion
```

### DB Rollback Strategies

Since MongoDB does not have built-in 2-phase commits outside transactions, the codebase uses the following patterns:

| Scenario | Strategy |
|---|---|
| **Cloudinary upload fails** | No DB document is created; error is returned to client. No cleanup needed. |
| **DB save fails after Cloudinary upload** | `cloudinary.uploader.destroy(result.public_id)` is called in the `catch` block to undo the uploaded file |
| **Permanent board delete** | Controller deletes all associated Lists, Cards, and Activities in the same async block before deleting the Board; partial deletes are logged but do not block the response |
| **Attachment delete** | `cloudinary.uploader.destroy(publicId)` is called first; then `$pull` removes the attachment sub-document from the Card |

---

## ⚙️ Environment Parameters

Create a `.env` file in the `server/` directory:

```env
PORT=4001                                   # Port the Express server listens on
DB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskmanager
JWT_SECRET_KEY=your_super_secret_jwt_key    # Use a long random string (32+ chars)
CLIENT_URL=http://localhost:5173            # Frontend origin for CORS whitelist
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (defaults to 4001) | HTTP server port |
| `DB_URL` | ✅ Yes | MongoDB connection string (Atlas or local) |
| `JWT_SECRET_KEY` | ✅ Yes | Secret for signing/verifying JWTs — **never commit this** |
| `CLIENT_URL` | ✅ Yes | Exact frontend URL including protocol and port |
| `CLOUDINARY_CLOUD_NAME` | ✅ Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | ✅ Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | ✅ Yes | From Cloudinary dashboard — **never commit this** |
| `GOOGLE_CLIENT_ID` | ✅ Yes | Google Cloud OAuth 2.0 Client ID |

---

## 🛠️ Local Developer Setup — Step by Step

### Prerequisites
- Node.js ≥ 18 (`node -v` to check)
- npm ≥ 9 (`npm -v` to check)
- A MongoDB Atlas cluster (or local MongoDB)
- A Cloudinary account
- A Google Cloud project with OAuth 2.0 credentials

### Step 1 — Navigate to the server directory

```bash
cd task-managerr/server
```

### Step 2 — Install all dependencies

```bash
npm install
```

This installs all packages listed in `package.json` into `node_modules/`.

### Step 3 — Set up MongoDB Atlas (if using cloud DB)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Database Access → Add user (username + password)
4. Network Access → Add IP Address → `0.0.0.0/0` (or your IP for development)
5. Connect → Drivers → copy the connection string
6. Replace `<password>` in the string and add your database name: `...mongodb.net/taskmanager`

### Step 4 — Set up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. Dashboard shows: Cloud Name, API Key, API Secret
3. Copy all three values into your `.env`

### Step 5 — Set up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → OAuth consent screen (External)
3. Credentials → Create Credentials → OAuth 2.0 Client ID → Web application
4. Authorized JavaScript Origins: `http://localhost:5173` (dev), `https://yourdomain.com` (prod)
5. Authorized redirect URIs: same as origins (Google Sign-In does not use redirects — this is for ID token flow)
6. Copy Client ID → paste in both `server/.env` (`GOOGLE_CLIENT_ID`) and `client/.env` (`VITE_GOOGLE_CLIENT_ID`)

### Step 6 — Configure environment variables

```bash
cp envexample.txt .env
```

Fill in all values as described in the **Environment Parameters** section above.

### Step 7 — Start the development server

```bash
npm run dev
```

Nodemon watches for file changes and restarts automatically. The server starts on `http://localhost:4001`.

Expected output:
```
[nodemon] starting `node server.js`
Database connected successfully
🚀 Server running on port 4001
```

### Step 8 — Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start with Nodemon (auto-restart on change) |
| Production | `npm start` | `node server.js` — no auto-restart |

---

## 📡 Nodemon Dev Server Configuration

Nodemon is configured via the `scripts.dev` entry in `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

Nodemon watches the directory recursively by default and restarts on `.js` file changes. For a custom watch list, add a `nodemon.json` file:

```json
{
  "watch": ["./"],
  "ext": "js,json",
  "ignore": ["node_modules/"]
}
```

---

## 🌐 Render Deployment Guide

### Step 1 — Create a Web Service on Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repository
3. Set **Root Directory** to `server` (if monorepo)
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. **Environment**: Node

### Step 2 — Set Environment Variables on Render

In the Render dashboard → Environment tab, add all variables from `.env`:

```
PORT             → (Render auto-assigns; leave blank or set to 4001)
DB_URL           → your Atlas connection string
JWT_SECRET_KEY   → your secret
CLIENT_URL       → https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
GOOGLE_CLIENT_ID
```

### Step 3 — Update CORS & Cookie settings for production

Ensure your `server.js` CORS origin matches the **exact** deployed frontend URL:

```js
app.use(cors({
  origin: [process.env.CLIENT_URL],  // e.g. https://task-manager.vercel.app
  credentials: true
}));
```

And that all `res.cookie()` calls include `secure: true` and `sameSite: "none"` for cross-origin cookie support.

### Step 4 — Keep the service alive (optional)

Render free-tier services sleep after 15 minutes of inactivity. Use [UptimeRobot](https://uptimerobot.com) to ping `https://your-service.onrender.com/` every 5 minutes to prevent cold starts.

---

## 🔌 Socket.io Server Events Reference (`sockets/boardSocket.js`)

All connected clients join a Socket.io room named after their `boardId`. Events flow from one client through the server and are broadcast to all other clients in the same room.

### Connection Lifecycle

| Event | Direction | Description |
|---|---|---|
| `connection` | Server receives | New WebSocket client connected |
| `join-board` | Client → Server | Client joins board room; server updates `onlineUsers[boardId]` |
| `leave-board` | Client → Server | Client leaves board room; server removes from `onlineUsers` |
| `disconnect` | Server receives | Socket dropped; server removes from all joined board rooms |
| `online-users` | Server → Room | Broadcast updated list of online users for the board |

### Card Events

| Client Emits | Server Broadcasts to Room | Payload |
|---|---|---|
| `card-added` | `card-added` | `{ boardId, card }` |
| `card-updated` | `card-updated` | `{ boardId, card }` |
| `card-deleted` | `card-deleted` | `{ boardId, cardId }` |
| `move-card` | `card-moved` | `{ boardId, cardId, listId, position }` |

### List & Board Events

| Client Emits | Server Broadcasts to Room | Payload |
|---|---|---|
| `list-added` | `list-added` | `{ boardId, list }` |
| `list-updated` | `list-updated` | `{ boardId, list }` |
| `list-deleted` | `list-deleted` | `{ boardId, listId }` |
| `board-updated` | `board-updated` | `{ boardId, board }` |
| `member-updated` | `member-updated` | `{ boardId, members }` |

> The server does **not** re-emit to the originating socket (`socket.to(boardId)` excludes the sender). This prevents double-updates on the client that triggered the action.
