# 📋 Task Manager — Full Stack Application

A full-featured collaborative task management application built with **React**, **Node.js/Express**, **MongoDB**, and **Socket.IO**. Supports real-time board collaboration, role-based access control, soft-delete trash management, card drag-and-drop, due dates, priorities, assignees, and email/link-based board invitations.

---

## 🗂️ Project Structure

```
task-managerr/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Zustand store (BoardContext) and AuthContext
│   │   │   └── slices/   # Zustand modular slices (board, list, card, etc.)
│   │   ├── pages/        # Route-level page components (Modular directories)
│   │   │   ├── BoardPage/
│   │   │   ├── UserDashboard/
│   │   │   ├── Home/
│   │   │   └── RegisterPage/
│   │   ├── services/     # Axios base URL config
│   │   ├── socket/       # Socket.IO client service
│   │   └── utils/        # Utility helpers
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/               # Node.js + Express backend
│   ├── Apis/             # Express routers (Modular index.js barrel files)
│   ├── config/           # MongoDB connection
│   ├── controllers/      # Route handler logic (Modularized per feature)
│   │   ├── auth/
│   │   ├── board/
│   │   ├── list/
│   │   ├── card/
│   │   └── invite/
│   ├── models/           # Mongoose schemas (Extracted sub-schemas)
│   ├── sockets/          # Socket.IO handlers
│   │   ├── handlers/     # Feature-specific socket logic
│   │   ├── onlineUsersStore.js
│   │   └── boardSocket.js
│   ├── utils/            # JWT, Uploads, Cloudinary middleware
│   ├── server.js         # App entry point
│   └── package.json
│
├── abhi.http             # REST API test file
├── test.http             # Additional API test file
└── README.md             # ← You are here
```

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Client (React + Vite :5173)"]
        UI[React Pages & Components]
        ZS[Zustand Store]
        AX[Axios HTTP Client]
        SC[Socket.IO Client]
        UI --> ZS
        ZS --> AX
        ZS --> SC
    end

    subgraph Server["⚙️ Server (Express :4001)"]
        MW[Middleware Stack<br/>cors · json · cookie-parser]
        VT[verifyToken Middleware]
        RT[Routers<br/>UserApi · BoardApi · ListApi · CardApi]
        CT[Controllers<br/>auth · board · list · card · invite]
        SIO[Socket.IO Server<br/>boardSocket]
        MW --> VT --> RT --> CT
    end

    subgraph DB["🗄️ MongoDB Atlas"]
        US[(Users)]
        BO[(Boards)]
        LI[(Lists)]
        CA[(Cards)]
        IT[(InviteTokens)]
        AC[(Activity)]
    end

    AX -- "REST over HTTP + Cookie" --> MW
    SC -- "WebSocket (ws://)" --> SIO
    CT --> DB
    SIO --> CT
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
# Server runs at http://localhost:4001
```

### 3. Start the frontend client

```bash
cd client
npm install
npm run dev
# Client runs at http://localhost:5173
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
| File Uploads | Multer (memory storage) + Cloudinary v2 |
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

### Sequence: User Registration

```mermaid
sequenceDiagram
    actor U as User
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB

    U->>C: Fill name, email, password → Submit
    C->>S: POST /user-api/signup { name, email, password }
    S->>DB: UserModel.findOne({ email })
    DB-->>S: null (email available)
    S->>S: bcrypt.hash(password, 8)
    S->>DB: new UserModel({ name, email, hashedPassword }).save()
    DB-->>S: User document saved
    S-->>C: 201 { message: "user created successfully" }
    C-->>U: Show success toast → Redirect to /login
```

### Sequence: User Login

```mermaid
sequenceDiagram
    actor U as User
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB

    U->>C: Enter email + password → Submit
    C->>S: POST /user-api/signin { email, password }
    S->>DB: UserModel.findOne({ email })
    DB-->>S: User document (with hashed password)
    S->>S: bcrypt.compare(password, user.password)
    alt Credentials valid
        S->>S: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" })
        S-->>C: 200 { payload: user } + Set-Cookie: token=JWT; HttpOnly; SameSite=Lax
        C->>C: AuthContext.setUser(user)
        C-->>U: Redirect to /dashboard
    else Invalid credentials
        S-->>C: 401 { message: "invalid credentials" }
        C-->>U: Show error toast
    end
```

### Sequence: Session Restore on App Load

```mermaid
sequenceDiagram
    participant C as React App (mount)
    participant PR as ProtectedRoute
    participant S as Express Server
    participant DB as MongoDB

    C->>S: GET /user-api/verify (cookie: token auto-sent)
    S->>S: verifyToken middleware → jwt.verify(token, JWT_SECRET)
    alt Token valid
        S->>DB: UserModel.findById(req.userId).select("-password")
        DB-->>S: User document
        S-->>C: 200 { payload: user }
        C->>C: AuthContext.setUser(user) → render dashboard
    else Token invalid / expired
        S-->>C: 401 { message: "Session invalid" }
        C->>PR: Redirect to /login
    end
```

### Sequence: Logout

```mermaid
sequenceDiagram
    actor U as User
    participant C as React Client
    participant S as Express Server

    U->>C: Click Logout button
    C->>S: POST /user-api/logout
    S->>S: res.clearCookie("token", { httpOnly, sameSite })
    S-->>C: 200 { message: "logout success" }
    C->>C: AuthContext.clearUser()
    C-->>U: Redirect to /login
```

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

## 🔄 Real-time Collaboration (Socket.IO)

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-board` | Client → Server | Join a board room |
| `leave-board` | Client → Server | Leave a board room |
| `card-added` | Broadcast | New card broadcast |
| `card-updated` | Broadcast | Card edit broadcast |
| `card-deleted` | Broadcast | Card delete broadcast |
| `card-moved` / `move-card` | Broadcast | Drag-and-drop broadcast |
| `list-added` | Broadcast | New list broadcast |
| `list-updated` | Broadcast | List edit broadcast |
| `list-deleted` | Broadcast | List delete broadcast |
| `board-updated` | Broadcast | Board settings/title change |
| `member-updated` | Broadcast | Member promote/demote/remove |
| `online-users` | Server → Client | Active users in board room |

### Sequence: Real-Time Card Add (Multi-user)

```mermaid
sequenceDiagram
    actor A as User A (Editor)
    actor B as User B (Viewer)
    participant CA as Client A
    participant CB as Client B
    participant S as Express Server
    participant SIO as Socket.IO Server
    participant DB as MongoDB

    Note over CA,CB: Both users already joined board room via join-board event

    A->>CA: Type card title → Press Enter
    CA->>CA: Optimistic UI: add temp card to list
    CA->>S: POST /card-api/addCard { title, list, position }
    S->>S: verifyToken middleware
    S->>DB: CardModel.create({ title, list, position, ... })
    DB-->>S: Saved card with real _id
    S-->>CA: 201 { payload: savedCard }
    CA->>CA: Replace temp card with real card in Zustand store
    CA->>SIO: emit("card-added", { boardId, card, listId })
    SIO->>CB: emit("card-added", { card, listId })
    CB->>CB: Zustand: append card to list in store → re-render
    CB-->>B: New card appears in real-time
```

### Sequence: Real-Time Card Move (Drag & Drop)

```mermaid
sequenceDiagram
    actor A as User A (Dragger)
    actor B as User B (Observer)
    participant CA as Client A
    participant CB as Client B
    participant S as Express Server
    participant SIO as Socket.IO Server
    participant DB as MongoDB

    A->>CA: Drag card → Drop on different list/position
    CA->>CA: Optimistic UI: moveCard() updates Zustand lists state
    CA->>S: PUT /card-api/moveCard/:id { toListId, newPosition }
    S->>DB: CardModel.findByIdAndUpdate(id, { list: toListId, position: newPosition })
    DB-->>S: Updated card
    S-->>CA: 200 OK
    CA->>SIO: emit("card-moved", { boardId, cardId, fromListId, toListId, newPosition })
    SIO->>CB: emit("card-moved", { cardId, fromListId, toListId, newPosition })
    CB->>CB: Zustand: splice card from source list, insert at destination
    CB-->>B: Card moves to new position in real-time
```

---

## 🗑️ Soft Delete / Trash System

All deletions are **soft deletes** — records receive `isDeleted: true` and a `deletedAt` timestamp. Items are recoverable from the Trash view in the UI. Permanent deletion purges the document from MongoDB.

### Sequence: Soft Delete → Restore → Permanent Delete (Board)

```mermaid
sequenceDiagram
    actor U as Owner
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB

    Note over U,DB: ── Soft Delete ──
    U->>C: Click "Delete Board"
    C->>S: DELETE /board-api/deleteBoard/:id
    S->>DB: BoardModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: now })
    DB-->>S: Updated board document
    S-->>C: 200 { message: "board deleted (soft delete)" }
    C->>C: Remove board from dashboard list (UI update)

    Note over U,DB: ── View Trash ──
    U->>C: Open Trash panel
    C->>S: GET /board-api/trash/deleted
    S->>DB: BoardModel.find({ owner: userId, isDeleted: true })
    DB-->>S: Array of soft-deleted boards
    S-->>C: 200 { payload: [deletedBoards] }
    C-->>U: Show boards in TrashView component

    Note over U,DB: ── Restore ──
    U->>C: Click "Restore" on a board
    C->>S: PUT /board-api/restore/:id
    S->>DB: BoardModel.findByIdAndUpdate(id, { isDeleted: false, deletedAt: null })
    DB-->>S: Restored board document
    S-->>C: 200 { message: "Board restored" }
    C->>C: Remove from deletedBoards state → re-fetch dashboard

    Note over U,DB: ── Permanent Delete ──
    U->>C: Click "Delete Forever"
    C->>S: DELETE /board-api/permanent/:id
    S->>DB: BoardModel.findByIdAndDelete(id)
    S->>DB: ListModel.find({ board: id }) → get listIds
    S->>DB: CardModel.deleteMany({ list: { $in: listIds } })
    S->>DB: ListModel.deleteMany({ board: id })
    DB-->>S: Cascade delete complete
    S-->>C: 200 { message: "Board permanently deleted" }
    C->>C: Remove from deletedBoards state
```

---

## 👥 Role-Based Access Control

| Role | Permissions |
|------|------------|
| **Owner** | Full access — create, edit, delete board, manage members, promote/demote admins |
| **Admin** | Edit board details, manage members, edit all cards |
| **Member** | View board, add cards, update card **status only** |

### Sequence: Card Update with Role Check

```mermaid
sequenceDiagram
    actor U as User (Member)
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB

    U->>C: Edit card title in Modal → Save
    C->>S: PUT /card-api/updateCard/:id { title: "New Title", ... }
    S->>S: verifyToken → req.userId set
    S->>DB: CardModel.findById(cardId) → get card.list
    S->>DB: ListModel.findById(card.list) → get list.board
    S->>DB: BoardModel.findById(list.board) → get board
    S->>S: isOwner = board.owner === req.userId
    S->>S: isAdmin = board.admins.includes(req.userId)
    S->>S: isMember = board.members.includes(req.userId)

    alt User is Owner or Admin
        S->>DB: CardModel.findByIdAndUpdate(id, { title, description, ... })
        DB-->>S: Updated card
        S-->>C: 200 { payload: updatedCard }
        C->>C: Update Zustand store → re-render
    else User is Member only
        S->>S: Check: isTitleChanged? → YES
        S-->>C: 403 { message: "Only board owners or admins can modify card details" }
        C-->>U: Show error toast "Permission denied"
    end
```

### Sequence: Member Management (Promote / Demote / Remove)

```mermaid
sequenceDiagram
    actor O as Board Owner
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB

    O->>C: Open MembersModal → Click "Promote to Admin" on a member
    C->>S: PUT /board-api/manage-member/:boardId { memberId, action: "promote" }
    S->>S: verifyToken → req.userId
    S->>DB: BoardModel.findById(boardId)
    DB-->>S: Board document
    S->>S: isOwner = board.owner === req.userId → true
    S->>S: isTargetOwner? → false (safe to proceed)
    S->>S: action === "promote" → board.admins.push(memberId)
    S->>DB: board.save()
    S->>DB: BoardModel.findById().populate(owner, members, admins)
    DB-->>S: Updated board with populated fields
    S-->>C: 200 { payload: updatedBoard }
    C->>C: useBoardStore.set({ board: updatedBoard })
    C-->>O: MembersModal re-renders with new Admin badge
```

---

## 📬 Invite System

### Sequence: Email Invite (Direct Add)

```mermaid
sequenceDiagram
    actor O as Board Owner
    participant C as React Client
    participant S as Express Server
    participant DB as MongoDB

    O->>C: Type email in InviteModal → Click Invite
    C->>S: POST /board-api/invite/email/:boardId { email }
    S->>S: verifyToken → req.userId
    S->>DB: BoardModel.findById(boardId)
    DB-->>S: Board document
    S->>S: board.owner === req.userId? → check ownership
    S->>DB: UserModel.findOne({ email: email.toLowerCase() })
    DB-->>S: Invitee user document

    alt User found and not already a member
        S->>DB: board.members.push(invitee._id) → board.save()
        S->>DB: BoardModel.findById().populate(owner, members, admins)
        DB-->>S: Updated board
        S-->>C: 200 { message: "User added", payload: updatedBoard }
        C->>C: useBoardStore.set({ board: updatedBoard })
        C-->>O: Success toast + member list updates
    else User not found
        S-->>C: 404 { message: "No account found with that email" }
    else Already a member
        S-->>C: 409 { message: "User is already a member" }
    end
```

### Sequence: Link Invite (Generate + Accept)

```mermaid
sequenceDiagram
    actor O as Board Owner
    actor G as Guest User
    participant CO as Client (Owner)
    participant CG as Client (Guest)
    participant S as Express Server
    participant DB as MongoDB

    Note over O,DB: ── Step 1: Generate Invite Link ──
    O->>CO: Click "Get Invite Link" in InviteModal
    CO->>S: POST /board-api/invite/link/:boardId
    S->>DB: InviteTokenModel.findOne({ boardId, expiresAt > now })
    alt Existing valid token found
        DB-->>S: Existing InviteToken
        S-->>CO: 200 { payload: { link, token } }
    else No valid token
        S->>S: token = randomUUID()
        S->>S: expiresAt = now + 7 days
        S->>DB: InviteTokenModel.create({ boardId, token, expiresAt })
        DB-->>S: Saved token
        S-->>CO: 201 { payload: { link, token } }
    end
    CO-->>O: Display link → Owner copies & shares it

    Note over G,DB: ── Step 2: Guest Accepts Invite ──
    G->>CG: Open invite URL /invite/:token
    CG->>S: GET /board-api/invite/accept/:token
    S->>S: verifyToken → Guest must be logged in
    S->>DB: InviteTokenModel.findOne({ token })
    DB-->>S: InviteToken document
    S->>S: invite.expiresAt > now? → valid
    S->>DB: BoardModel.findById(invite.boardId)
    DB-->>S: Board document
    S->>S: isOwner || isMember already? → check
    alt Not yet a member
        S->>DB: board.members.push(req.userId) → board.save()
        S-->>CG: 200 { payload: { boardId, alreadyMember: false } }
        CG-->>G: Redirect to /board/:boardId
    else Already a member
        S-->>CG: 200 { payload: { boardId, alreadyMember: true } }
        CG-->>G: Redirect to /board/:boardId
    end
```

---

## 📎 File Upload & Attachment System

The application uses **Multer** (memory storage) on the backend to receive multipart file uploads, then streams the file buffers directly to **Cloudinary** via `cloudinary.uploader.upload_stream`. This avoids writing temporary files to disk.

### Supported Upload Types

| Feature | Field Name | Max Size | Allowed Types | Max Files |
|---------|-----------|----------|---------------|-----------|
| Avatar | `avatar` | 5 MB | Images only (`image/*`) | 1 |
| Card Attachments | `files` | 10 MB each | Images, PDF, Word, Excel, PowerPoint, Text, CSV, ZIP, RAR | 5 per request |
| Remark Attachments | `files` | 10 MB each | Same as card attachments | 5 per request |

### Card Attachment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/card-api/attachments/:cardId` | Upload files to a card (multipart/form-data) |
| `DELETE` | `/card-api/attachments/:cardId/:attachmentId` | Remove a specific attachment from a card |

### Remark Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/card-api/remarks/:cardId` | Add a remark with optional file attachments |
| `DELETE` | `/card-api/remarks/:cardId/:remarkId` | Delete a specific remark |

### Avatar Upload Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/user-api/upload-avatar` | Upload a profile picture (returns Cloudinary URL) |

### Sequence: File Upload to Cloudinary (Buffer Stream)

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Express Server
    participant ML as Multer (memoryStorage)
    participant CL as Cloudinary
    participant DB as MongoDB

    C->>S: POST /card-api/attachments/:cardId (multipart/form-data)
    S->>ML: Parse file buffers into req.files[]
    loop For each file in req.files
        S->>CL: cloudinary.uploader.upload_stream(buffer)
        CL-->>S: { secure_url, public_id, bytes, format }
    end
    S->>DB: card.attachments.push({ name, url, type, size, publicId, uploadedBy })
    S->>DB: card.save()
    DB-->>S: Updated card
    S-->>C: 200 { payload: updatedCard }
```

---

## 📝 Activity Logging

All significant board actions (card creation, movement, deletion, member changes, etc.) are logged via the `Activity` model. Activities are fetched and displayed in the `ActivityView` component.

### Activity Model Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `board` | ObjectId → Board | ✅ | The board this activity belongs to |
| `user` | ObjectId → User | ✅ | The user who performed the action |
| `action` | String | ✅ | Human-readable description of the action |
| `timestamp` | Date | ❌ | Defaults to `Date.now` |

### Activity Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/board-api/activity/:boardId` | Fetch all activity logs for a board |

---

## 📁 Detailed Documentation

| README | Contents |
|--------|----------|
| [`client/README.md`](./client/README.md) | React components, Zustand store, Axios setup, Tailwind design system, local dev setup |
| [`server/README.md`](./server/README.md) | Express routes, Mongoose models, JWT auth, REST API reference, deployment |
