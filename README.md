# Task Manager — Full-Stack Kanban Application

A full-stack, real-time collaborative Kanban task management application built with **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend. It supports Google OAuth, JWT-based session management via HttpOnly cookies, Cloudinary file uploads, Socket.io real-time sync, and a soft-delete trash system.

---

## Monorepo Structure

```
task-managerr/
├── client/                  # React + Vite frontend application
│   ├── src/
│   │   ├── components/      # Shared UI components (Board, Card, Modal, Navbar…)
│   │   ├── context/         # Zustand stores (AuthContext, BoardContext)
│   │   ├── pages/           # Route-level page components
│   │   ├── services/        # Axios base URL config
│   │   ├── socket/          # Socket.io client setup
│   │   └── utils/           # Shared utility helpers
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Express + MongoDB backend application
│   ├── Apis/                # Express Router definitions (UserApi, BoardApi, …)
│   ├── config/              # DB and Cloudinary configuration
│   ├── controllers/         # Business logic for each resource
│   ├── models/              # Mongoose schemas (User, Board, List, Card, …)
│   ├── sockets/             # Socket.io event handlers
│   ├── utils/               # Token generation, upload middleware, activity logger
│   ├── server.js            # Express + HTTP + Socket.io app entry point
│   └── package.json
│
├── all_changes_log.md       # Running changelog
└── README.md                # ← You are here
```

---

## Feature Overview

| Feature | Details |
|---|---|
| **Authentication** | Email/password signup & login, Google OAuth 2.0 |
| **Session Security** | JWT stored in HttpOnly cookies; verified server-side on every protected request |
| **Kanban Boards** | Create, edit, delete, restore boards with custom backgrounds |
| **Lists & Cards** | Full CRUD with drag-and-drop card movement and position persistence |
| **Collaboration** | Invite members via email or shareable link with request-and-approval flow (accept/reject pending users); role system (Owner → Admin → Member) |
| **Real-time Sync** | Socket.io broadcasts board, list, card, and member events to all active collaborators |
| **File Uploads** | Avatar (5 MB image) and card attachments/remarks (10 MB, multi-format) via Cloudinary |
| **Trash System** | Soft-delete for boards, lists, and cards; full restore and permanent-delete support |
| **Activity Log** | Per-board activity trail with actor details |
| **Calendar View** | FullCalendar integration showing card due dates |

---

## Application Flow Diagrams

### 1. General Application Navigation & Page Flow

This flowchart describes the screen routing and authentication logic flows throughout the application.

```mermaid
graph TD
    Start([User Visits App]) --> Home{Is Authenticated?}
    Home -- Yes --> Dashboard[User Dashboard]
    Home -- No --> PublicHome[Public Landing Page]
    
    PublicHome --> Login[Login Page]
    PublicHome --> Register[Register Page]
    
    Register -- DNS MX Check Valid --> Login
    Register -- DNS MX Check Invalid --> Register
    
    Login -- JWT Cookie Set --> Dashboard
    
    Dashboard --> CreateBoard[Create Board Page]
    Dashboard --> BoardPage[Board Kanban View]
    Dashboard --> AccountPage[Account Profile Page]
    
    BoardPage --> ViewToggle{View Toggle}
    ViewToggle -- Kanban --> BoardPage
    ViewToggle -- Calendar --> CalendarView[Calendar Due Date View]
    ViewToggle -- Trash --> TrashView[Soft-Deleted Items View]
    
    InviteLink[Click Shareable Invite Link] --> AcceptInvite[Accept Invite Page]
    AcceptInvite -- Logged In & Submit --> PendingRequest[Create Pending Join Request]
    PendingRequest --> Dashboard
    
    BoardPage -- Owner/Admin clicks notification --> MembersModal[Manage Members & Requests]
    MembersModal -- Approve Request --> JoinSuccess[User Added as Board Member]
```

### 2. Request-and-Approval Invite Link Flow

This sequence diagram depicts how a guest requests to join a board via a shareable token link and how the board owner or admin handles it with real-time feedback.

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Board Owner (User A)
    actor Joiner as Invitee (User B)
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant DB as MongoDB
    participant WS as WebSocket (Socket.io)
    
    Owner->>FE: "Generate Invite Link"
    FE->>BE: "POST /board-api/invite/link/:boardId"
    BE->>DB: "Save InviteToken (with expiry)"
    BE-->>FE: "201 Created (Token url)"
    FE->>Owner: "Display copyable link"
    
    Owner->>Joiner: "Send Invite Link (outside app)"
    Joiner->>FE: "Open Invite Link in Browser"
    FE->>BE: "GET /board-api/invite/accept/:token"
    BE->>DB: "Validate Token & Find Board"
    BE->>DB: "Add User B to board.pendingRequests"
    BE-->>FE: "200 OK (status: pending)"
    FE->>Joiner: "Show Request Submitted countdown"
    
    note over Owner, BE: Real-time Notification
    BE->>WS: "Emit member-updated (User B pending)"
    WS-->>FE: "Broadcast update to Board Room"
    FE->>Owner: "Display pulsing red badge (Count = 1)"
    
    Owner->>FE: "Click badge -> open MembersModal"
    FE->>Owner: "Show Candidate User B with Accept/Reject"
    Owner->>FE: "Click Accept"
    FE->>BE: "PUT /board-api/invite/handle-request/:boardId (action: accept)"
    BE->>DB: "Move User B from pendingRequests to members"
    BE-->>FE: "200 OK (success message)"
    BE->>WS: "Emit member-updated (User B added)"
    WS-->>FE: "Broadcast updated member list to room"
    FE->>Owner: "Update Members list in UI"
    FE->>Joiner: "Grant access to Board canvas"
```

---

## Technology Stack

### Frontend (`/client`)

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI library |
| Vite | 7.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Zustand | 5.x | Global state management |
| Axios | 1.x | HTTP client for API calls |
| React Router | 7.x | Client-side routing |
| React Hook Form | 7.x | Form state & validation |
| Socket.io-client | 4.x | Real-time WebSocket client |
| @react-oauth/google | 0.13.x | Google Sign-In button |
| FullCalendar | 6.x | Calendar view for due dates |
| React Hot Toast | 2.x | Toast notifications |

### Backend (`/server`)

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 5.x | Web framework |
| Mongoose | 9.x | MongoDB ODM |
| bcryptjs | 3.x | Password hashing |
| jsonwebtoken | 9.x | JWT generation & verification |
| cookie-parser | 1.x | HttpOnly cookie parsing |
| Socket.io | 4.x | Real-time WebSocket server |
| Multer | 2.x | Multipart file upload middleware |
| Cloudinary | 2.x | Cloud file storage |
| google-auth-library | 10.x | Google OAuth token verification |
| dotenv | 16.x | Environment variable loading |
| cors | 2.x | Cross-origin request control |
| nodemon | 3.x | Auto-restart dev server |

---

## Authentication & Security Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant DB as MongoDB
    
    User->>FE: "Enter Credentials & Submit Login"
    FE->>BE: "POST /user-api/signin"
    BE->>DB: "Find User by Email"
    DB-->>BE: "User Document (hashed password)"
    BE->>BE: "bcrypt.compare(password, hash)"
    alt Credentials Valid
        BE->>BE: "Generate JWT signed with JWT_SECRET_KEY"
        BE-->>FE: "200 OK + Set-Cookie (token=JWT, HttpOnly, Secure)"
        FE->>User: "Redirect to /dashboard"
    else Credentials Invalid
        BE-->>FE: "401 Unauthorized (error message)"
        FE->>User: "Display error message"
    end
    
    note over User, BE: Session Verification on page refresh / protected route mount
    User->>FE: "Load Dashboard Route"
    FE->>BE: "GET /user-api/verify (cookie sent automatically)"
    BE->>BE: "jwt.verify(token, JWT_SECRET_KEY)"
    alt JWT Valid
        BE-->>FE: "200 OK (User profile payload)"
        FE->>User: "Render Dashboard"
    else JWT Invalid / Expired
        BE-->>FE: "401 Unauthorized"
        FE->>User: "Redirect to /login"
    end
```

- **HttpOnly cookies** — token is never accessible via JavaScript, preventing XSS theft
- **JWT expiry** — tokens expire after `1d`; session is re-verified on each page load via `/user-api/verify`
- **Role-based access** — Board controllers enforce Owner / Admin / Member permission checks before mutating data
- **CORS** — restricted to `CLIENT_URL` with `credentials: true`

---

## Real-Time Events (Socket.io)

All board collaborators join a Socket.io room identified by `boardId`. Any mutating action (add/update/delete card, list, or board setting) emits the corresponding event to the room.

```mermaid
sequenceDiagram
    autonumber
    actor UserA as Collaborator A
    actor UserB as Collaborator B
    participant FE_A as User A Frontend
    participant FE_B as User B Frontend
    participant BE as Backend Server
    participant WS as Socket.io Server
    
    UserA->>FE_A: "Drag Card to In Progress"
    FE_A->>BE: "PUT /card-api/moveCard/:cardId"
    BE-->>FE_A: "200 OK (Card moved in DB)"
    FE_A->>WS: "Emit move-card { boardId, cardId, listId, position }"
    WS->>WS: "Identify Board Room"
    WS-->>FE_B: "Broadcast card-moved payload"
    FE_B->>FE_B: "Update local Zustand store optimistically"
    FE_B->>UserB: "Render card in In Progress in real-time"
```

| Emit Event | Broadcast Event | Payload |
|---|---|---|
| `join-board` | `online-users` | `[{ socketId, user }]` |
| `move-card` | `card-moved` | `{ boardId, cardId, … }` |
| `card-added` | `card-added` | `{ boardId, card }` |
| `card-updated` | `card-updated` | `{ boardId, card }` |
| `card-deleted` | `card-deleted` | `{ boardId, cardId }` |
| `list-added` | `list-added` | `{ boardId, list }` |
| `list-updated` | `list-updated` | `{ boardId, list }` |
| `list-deleted` | `list-deleted` | `{ boardId, listId }` |
| `board-updated` | `board-updated` | `{ boardId, board }` |
| `member-updated` | `member-updated` | `{ boardId, members }` |
| `leave-board` | `online-users` (updated) | — |

---

## Quick Start (Local Development)

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A running MongoDB instance (local or Atlas)
- A Cloudinary account
- A Google Cloud project with OAuth 2.0 credentials

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-managerr
```

### 2. Set up the Server

```bash
cd server
npm install
cp envexample.txt .env   # then fill in your values (see server/README.md)
npm run dev              # starts on http://localhost:4001
```

### 3. Set up the Client

```bash
cd ../client
npm install
cp envexample.txt .env   # then fill in your values (see client/README.md)
npm run dev              # starts on http://localhost:5173
```

---

## Sub-Directory Documentation

| README | Contents |
|---|---|
| [`client/README.md`](./client/README.md) | React architecture, Zustand stores, component map, Axios setup, environment variables, and full client setup guide |
| [`server/README.md`](./server/README.md) | Express pipeline, Mongoose models, REST API reference, auth flow, Multer/Cloudinary, Socket.io, and deployment guide |

---

## Deployment

| Tier | Platform | Notes |
|---|---|---|
| **Backend** | [Render](https://render.com) | Web Service; set all env vars in Render dashboard |
| **Frontend** | [Vercel](https://vercel.com) / [Netlify](https://netlify.com) | Static site; set `VITE_API_URL` to the Render service URL |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | M0 free tier is sufficient for development |
| **Media** | [Cloudinary](https://cloudinary.com) | Free tier supports avatars + attachments |

---

## License

ISC
