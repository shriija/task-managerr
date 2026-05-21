# 📋 Task Manager — Full Stack Application

A full-featured collaborative task management application built with **React**, **Node.js/Express**, **MongoDB**, and **Socket.IO**. Supports real-time board collaboration, role-based access control, soft-delete trash management, card drag-and-drop, due dates, priorities, assignees, and email/link-based board invitations.

---

## 🗂️ Project Structure

```
task-managerr/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Zustand stores (BoardContext, AuthContext)
│   │   ├── pages/        # Route-level page components
│   │   ├── services/     # Axios base URL config
│   │   ├── socket/       # Socket.IO client service
│   │   └── utils/        # Utility helpers
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/               # Node.js + Express backend
│   ├── Apis/             # Express routers (UserApi, BoardApi, ListApi, CardApi)
│   ├── config/           # MongoDB connection
│   ├── controllers/      # Route handler logic
│   ├── models/           # Mongoose schemas
│   ├── sockets/          # Socket.IO event handlers
│   ├── utils/            # JWT generation & verification middleware
│   ├── server.js         # App entry point
│   └── package.json
│
├── abhi.http             # REST API test file
├── test.http             # Additional API test file
└── README.md             # ← You are here
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v18+ |
| npm | v9+ |
| MongoDB Atlas | Active cluster |

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-managerr
```

### 2. Start the backend server

```bash
cd server
npm install
# Create .env file (see server/README.md for required variables)
npm run dev
# Server runs on http://localhost:4001
```

### 3. Start the frontend client

```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 🏗️ Tech Stack Overview

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 |
| State Management | Zustand v5 |
| Forms & Validation | React Hook Form v7 |
| HTTP Client | Axios v1 |
| Real-time | Socket.IO v4 (client + server) |
| Calendar View | FullCalendar v6 |
| Backend Framework | Express v5 |
| Database | MongoDB via Mongoose v9 |
| Authentication | JWT + HttpOnly Cookies |
| Password Hashing | bcryptjs |
| Notifications | react-hot-toast |
| Dev Server | Nodemon (server) / Vite (client) |

---

## 🔐 Authentication Flow

1. User registers via `POST /user-api/signup` → password hashed with bcrypt (salt rounds: 8)
2. User logs in via `POST /user-api/signin` → JWT signed and set as **HttpOnly cookie** (`token`, 7-day expiry)
3. All protected routes run through the `verifyToken` middleware which reads the cookie
4. Session validation: `GET /user-api/verify` — used on app load to restore auth state
5. Logout: `POST /user-api/logout` → clears the `token` cookie

---

## 🌐 API Base Routes

| Router Mount | Description |
|--------------|-------------|
| `/user-api` | Auth — signup, signin, logout, session verify, user search |
| `/board-api` | Board CRUD, trash, invitations, member management |
| `/list-api` | List CRUD + soft-delete trash |
| `/card-api` | Card CRUD, move, soft-delete trash |

> See `server/README.md` for the complete endpoint reference with payloads.

---

## 🔄 Real-time Events (Socket.IO)

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-board` | Client → Server | Join a board room |
| `leave-board` | Client → Server | Leave a board room |
| `card-added` | Server → Client | New card broadcast |
| `card-updated` | Server → Client | Card edit broadcast |
| `card-deleted` | Server → Client | Card delete broadcast |
| `card-moved` | Server → Client | Drag-and-drop broadcast |
| `list-added` | Server → Client | New list broadcast |
| `list-updated` | Server → Client | List edit broadcast |
| `list-deleted` | Server → Client | List delete broadcast |
| `online-users` | Server → Client | Active users in board room |

---

## 🗑️ Soft Delete / Trash System

All deletions are **soft deletes** — records receive `isDeleted: true` and a `deletedAt` timestamp. Items are recoverable from the Trash view in the UI. Permanent deletion purges the document from MongoDB.

- **Boards** — soft deleted via `DELETE /board-api/deleteBoard/:id`, restored via `PUT /board-api/restore/:id`
- **Lists** — soft deleted via `DELETE /list-api/deleteList/:id`, restored via `PUT /list-api/restore/:id`
- **Cards** — soft deleted via `DELETE /card-api/deleteCards/:id`, restored via `PUT /card-api/restore/:id`

---

## 👥 Role-Based Access Control

| Role | Permissions |
|------|------------|
| **Owner** | Full access — create, edit, delete board, manage members, promote/demote admins |
| **Admin** | Edit board details, manage members, edit all cards |
| **Member** | View board, add cards, update card **status only** |

> Regular members attempting to modify card title, description, due date, priority, or assignees receive a `403 Forbidden` response.

---

## 📬 Invite System

- **Email invite**: `POST /board-api/invite/email/:boardId` — adds a registered user directly to the board
- **Link invite**: `POST /board-api/invite/link/:boardId` — generates a shareable JWT-based invite token
- **Accept invite**: `GET /board-api/invite/accept/:token` — validates the token and adds user to the board

---

## 📁 Detailed Documentation

| README | Contents |
|--------|----------|
| [`client/README.md`](./client/README.md) | React components, Zustand store, Axios setup, Tailwind design system, local dev setup |
| [`server/README.md`](./server/README.md) | Express routes, Mongoose models, JWT auth, REST API reference, deployment |
