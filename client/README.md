# Client — React + Vite Frontend

This directory contains the full frontend application for the Task Manager project. It is a single-page application (SPA) built with **React 19**, **Vite 7**, **Tailwind CSS 4**, and **Zustand 5** for global state management.

---

## Packages & Dependencies

### Production Dependencies

| Package | Version | Role |
|---|---|---|
| `react` | ^19.2.0 | Core UI library |
| `react-dom` | ^19.2.0 | DOM rendering |
| `react-router` | ^7.13.1 | Client-side routing (v7 — loader-based) |
| `zustand` | ^5.0.12 | Lightweight global state management |
| `axios` | ^1.13.6 | Promise-based HTTP client for API calls |
| `react-hook-form` | ^7.71.2 | Performant, uncontrolled form handling with validation |
| `react-hot-toast` | ^2.6.0 | Declarative toast notification system |
| `tailwindcss` | ^4.2.1 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.2.1 | Tailwind v4 Vite plugin (replaces postcss config) |
| `socket.io-client` | ^4.8.3 | WebSocket client for real-time board sync |
| `@react-oauth/google` | ^0.13.5 | Google OAuth 2.0 Sign-In button component |
| `@fullcalendar/react` | ^6.1.20 | React wrapper for FullCalendar |
| `@fullcalendar/core` | ^6.1.20 | FullCalendar core engine |
| `@fullcalendar/daygrid` | ^6.1.20 | Monthly/daily grid view |
| `@fullcalendar/timegrid` | ^6.1.20 | Time-slot grid view |
| `@fullcalendar/interaction` | ^6.1.20 | Click & drag interactions on calendar |

### Dev Dependencies

| Package | Version | Role |
|---|---|---|
| `vite` | ^7.3.1 | Lightning-fast build tool & dev server |
| `@vitejs/plugin-react` | ^5.1.1 | Vite React plugin (Fast Refresh, JSX transform) |
| `eslint` | ^9.39.1 | JavaScript linter |
| `eslint-plugin-react-hooks` | ^7.0.1 | Enforces React Hooks rules |
| `eslint-plugin-react-refresh` | ^0.4.24 | Guards against breaking Fast Refresh |
| `@eslint/js` | ^9.39.1 | ESLint flat config helpers |
| `@types/react` | ^19.2.7 | TypeScript types for React (optional, for IDEs) |
| `@types/react-dom` | ^19.2.3 | TypeScript types for ReactDOM |
| `globals` | ^16.5.0 | ESLint global variable definitions |

---

## Directory Structure & Design System

```
client/
├── public/                          # Static assets served as-is
├── src/
│   ├── assets/                      # Imported image/SVG assets (bundled by Vite)
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── ActivityView.jsx         # Per-board activity log feed
│   │   ├── AttachmentsSection.jsx   # Card attachment upload & list
│   │   ├── Board.jsx                # Board canvas (list columns container)
│   │   ├── CalendarView.jsx         # FullCalendar integration (due-date view)
│   │   ├── Card.jsx                 # Individual task card (compact view)
│   │   ├── InviteModal.jsx          # Invite by email or shareable link UI
│   │   ├── List.jsx                 # Column container + add-card form
│   │   ├── MembersModal.jsx         # Board members management UI
│   │   ├── Modal.jsx                # Full card detail modal (edit, assignees, remarks)
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   ├── ProtectedRoute.jsx       # Auth guard for private routes
│   │   ├── RemarksSection.jsx       # Card comments/remarks with file support
│   │   └── TrashView.jsx            # Soft-deleted boards/cards/lists viewer
│   │
│   ├── context/                     # Zustand global stores
│   │   ├── AuthContext.js           # Authentication store (user, session, login, logout)
│   │   └── BoardContext.js          # Board data store (board, lists, cards, members)
│   │
│   ├── hooks/                       # Custom React hooks (reserved for future use)
│   │
│   ├── pages/                       # Route-level page components
│   │   ├── AcceptInvitePage.jsx     # Handles invite token acceptance flow
│   │   ├── AccountManagementPage.jsx # Profile, password change, avatar upload
│   │   ├── BoardPage.jsx            # Board view with kanban/calendar/trash tabs
│   │   ├── CreateBoardPage.jsx      # Board creation form
│   │   ├── Home.jsx                 # Landing page (public)
│   │   ├── Loginpage.jsx            # Sign-in form (email + Google)
│   │   ├── RegisterPage.jsx         # Multi-step registration form
│   │   ├── RootLayout.jsx           # Shell layout with <Outlet />
│   │   └── UserDashboard.jsx        # Dashboard — My Boards, Shared Boards, Trash
│   │
│   ├── services/
│   │   └── api.js                   # Central Axios base URL export
│   │
│   ├── socket/                      # Socket.io client initialization & hooks
│   │
│   ├── utils/                       # Shared utility functions (reserved)
│   │
│   ├── App.jsx                      # Router configuration (createBrowserRouter)
│   ├── main.jsx                     # ReactDOM.createRoot entry point
│   └── index.css                    # Global CSS resets & Tailwind directives
│
├── index.html                       # Vite HTML entry point
├── vite.config.js                   # Vite + React + Tailwind plugin config
├── eslint.config.js                 # ESLint flat config
├── package.json
└── envexample.txt                   # Environment variable template
```

---

## Layout Structure & Routing

The application uses **React Router v7** with `createBrowserRouter`. All authenticated routes are wrapped in `<ProtectedRoute>`, which checks the `isAuthenticated` flag from the Zustand auth store.

```
/ (RootLayout)
├── /                         → Home (public landing page)
├── /register                 → RegisterPage (public)
├── /login                    → Loginpage (public)
├── /profile                  → AccountManagementPage [Protected]
├── /dashboard                → UserDashboard [Protected]
├── /dashboard/:tab           → UserDashboard with active tab [Protected]
├── /create-board             → CreateBoardPage [Protected]
├── /board/:id                → BoardPage (kanban view) [Protected]
├── /board/:id/:view          → BoardPage with view tab [Protected]
└── /invite/:token            → AcceptInvitePage [Protected]
```

### ProtectedRoute Logic

```jsx
// components/ProtectedRoute.jsx
// 1. On mount: calls useAuthStore.verifySession() → hits GET /user-api/verify
// 2. If valid cookie  → renders children
// 3. If no/expired cookie → redirects to /login
```

---

## Design System

The project uses **Tailwind CSS v4** (Vite plugin — no `tailwind.config.js` needed). The global stylesheet is `src/index.css`.

- **Font**: System default (configurable in `index.css`)
- **Colors**: Tailwind palette extended with board-specific custom colors
- **Dark/Light**: Not explicitly themed; uses Tailwind's default light palette
- **Breakpoints**: Tailwind's default responsive breakpoints (`sm`, `md`, `lg`, `xl`)
- **Animations**: CSS transitions on hover, Tailwind `transition` utilities for cards and modals

### Component Patterns

| Pattern | Implementation |
|---|---|
| **Controlled inputs** | `react-hook-form` `register()` + `Controller` for complex inputs |
| **Optimistic UI** | Board/Card state updated immediately in Zustand store; errors rolled back |
| **Modal overlay** | Rendered via `ReactDOM.createPortal` into `document.body` in `Modal.jsx` |
| **Drag & Drop** | Native HTML5 drag events on `Card.jsx` + `moveCard` API call |

---

## Zustand Store Actions, Lifecycle Triggers & Data Flows

### `useAuthStore` (`src/context/AuthContext.js`)

**State shape:**
```js
{
  currentUser: null | UserObject,
  loading: boolean,
  isAuthenticated: boolean,
  error: null | string
}
```

**Actions & when they trigger:**

| Action | Trigger | Effect |
|---|---|---|
| `verifySession()` | `ProtectedRoute` mount, page refresh | `GET /user-api/verify` → sets `currentUser` |
| `login(credentials)` | Login form submit | `POST /user-api/signin` → sets `currentUser` + `isAuthenticated` |
| `googleLogin(token)` | Google OAuth button success | `POST /user-api/google-signin` → same as login |
| `logout()` | Navbar logout button | `POST /user-api/logout` → clears cookie + resets state |
| `updateProfile(name)` | Account page form submit | `PUT /user-api/profile` → patches `currentUser.name` |
| `changePassword(obj)` | Password change form | `PUT /user-api/change-password` → returns updated user |
| `clearAuth()` | Axios 401 interceptor | Resets all auth state without API call |

**Data flow for login:**
```
LoginPage form submit
  → useAuthStore.login({ email, password })
    → axios.post('/user-api/signin', data, { withCredentials: true })
      → Server sets HttpOnly cookie
      → Returns { payload: UserObject }
    → set({ isAuthenticated: true, currentUser: payload })
  → React Router navigates to /dashboard
```

---

### `useBoardStore` (`src/context/BoardContext.js`)

**State shape:**
```js
{
  board: null | BoardObject,
  lists: [],
  cards: {},           // { [listId]: CardObject[] }
  members: [],
  onlineUsers: [],
  loading: boolean,
  error: null | string
}
```

**Key actions & socket lifecycle:**

| Action | Trigger | API + Socket |
|---|---|---|
| `fetchBoard(id)` | `BoardPage` mount | `GET /board-api/:id` |
| `addList(data)` | "Add List" button | `POST /list-api/addList` → emits `list-added` |
| `addCard(data)` | "Add Card" button | `POST /card-api/addCard` → emits `card-added` |
| `moveCard(id, data)` | Drag end event | `PUT /card-api/moveCard/:id` → emits `move-card` |
| `updateCard(id, data)` | Modal field changes | `PUT /card-api/updateCard/:id` → emits `card-updated` |
| `deleteCard(id)` | Card menu action | `DELETE /card-api/deleteCards/:id` → emits `card-deleted` |
| `inviteByEmail(data)` | Invite modal submit | `POST /board-api/invite/email/:boardId` |
| `manageMember(data)` | Members modal action | `PUT /board-api/manage-member/:boardId` → emits `member-updated` |

**Socket.io receive events** (applied to local state without API re-fetch):
- `card-moved` → Updates card position in `cards[listId]` array
- `card-added` → Appends card to `cards[listId]`
- `card-updated` → Patches matching card in `cards`
- `card-deleted` → Removes card from `cards`
- `list-added` / `list-updated` / `list-deleted` → Mutates `lists` array
- `online-users` → Updates `onlineUsers` (shown as avatars in navbar)

---

## Axios Setup, Global Response Interceptors & Endpoints

### Base URL Configuration (`src/services/api.js`)

```js
// Uses Vite env variable with localhost fallback for development
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";
```

All Zustand actions use `axios` with `{ withCredentials: true }` to ensure the HttpOnly cookie is sent on every request.

### Global 401 Interceptor (in `AuthContext.js`)

```js
// Automatic logout on token expiry — example pattern used across the codebase:
// If any axios request returns 401, useAuthStore.clearAuth() is called,
// redirecting the user back to /login without a manual logout action.
```

### API Endpoint Reference

#### User API (`/user-api`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/user-api/signup` | ✗ | Register new user |
| `POST` | `/user-api/signin` | ✗ | Login, receive JWT cookie |
| `POST` | `/user-api/google-signin` | ✗ | Google OAuth login |
| `POST` | `/user-api/logout` | ✗ | Clear session cookie |
| `GET` | `/user-api/verify` | ✓ | Verify active session |
| `GET` | `/user-api/search?q=` | ✓ | Search users by name/email |
| `PUT` | `/user-api/profile` | ✓ | Update display name |
| `PUT` | `/user-api/change-password` | ✓ | Set or change password |
| `POST` | `/user-api/upload-avatar` | ✗ | Upload avatar during registration |

#### Board API (`/board-api`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/board-api/addBoard` | ✓ | Create a board |
| `GET` | `/board-api/` | ✓ | Get all owned boards |
| `GET` | `/board-api/shared/all` | ✓ | Get boards shared with you |
| `GET` | `/board-api/:id` | ✓ | Get single board |
| `PUT` | `/board-api/updateBoard/:id` | ✓ | Update board settings |
| `DELETE` | `/board-api/deleteBoard/:id` | ✓ | Soft-delete board |
| `GET` | `/board-api/trash/deleted` | ✓ | View trashed boards |
| `PUT` | `/board-api/restore/:id` | ✓ | Restore trashed board |
| `DELETE` | `/board-api/permanent/:id` | ✓ | Permanently delete board |
| `PUT` | `/board-api/manage-member/:boardId` | ✓ | Add / remove / promote members |
| `GET` | `/board-api/activity/:boardId` | ✓ | Board activity log |
| `POST` | `/board-api/invite/email/:boardId` | ✓ | Invite via email |
| `POST` | `/board-api/invite/link/:boardId` | ✓ | Generate invite link |
| `GET` | `/board-api/invite/accept/:token` | ✓ | Accept invite |

#### List API (`/list-api`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/list-api/addList` | ✓ | Create list in a board |
| `GET` | `/list-api/getLists/:boardId` | ✓ | Get all lists for board |
| `GET` | `/list-api/getListById/:id` | ✓ | Get single list |
| `PUT` | `/list-api/updateList/:id` | ✓ | Rename list |
| `DELETE` | `/list-api/deleteList/:id` | ✓ | Soft-delete list |
| `GET` | `/list-api/trash/deleted/:boardId` | ✓ | Deleted lists for board |
| `PUT` | `/list-api/restore/:id` | ✓ | Restore list |
| `DELETE` | `/list-api/permanent/:id` | ✓ | Permanently delete list |

#### Card API (`/card-api`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/card-api/addCard` | ✓ | Create card |
| `GET` | `/card-api/getCards/:id` | ✓ | Get cards for a list |
| `GET` | `/card-api/getCardById/:id` | ✓ | Get single card detail |
| `PUT` | `/card-api/updateCard/:id` | ✓ | Update card fields |
| `PUT` | `/card-api/moveCard/:id` | ✓ | Move card (drag & drop) |
| `DELETE` | `/card-api/deleteCards/:id` | ✓ | Soft-delete card |
| `GET` | `/card-api/trash/deleted/:boardId` | ✓ | Deleted cards for board |
| `PUT` | `/card-api/restore/:id` | ✓ | Restore card |
| `DELETE` | `/card-api/permanent/:id` | ✓ | Permanently delete card |
| `POST` | `/card-api/attachments/:cardId` | ✓ | Upload file attachments |
| `DELETE` | `/card-api/attachments/:cardId/:attachmentId` | ✓ | Delete attachment |
| `POST` | `/card-api/remarks/:cardId` | ✓ | Post remark (with optional files) |
| `DELETE` | `/card-api/remarks/:cardId/:remarkId` | ✓ | Delete remark |

---

## React UI Components — Forms & Validation

### Registration Form (`RegisterPage.jsx`)
- Library: `react-hook-form`
- Fields: `name` (minLength 2), `email` (pattern: RFC 5322), `password` (minLength 6)
- Optional avatar upload via `FormData` to `POST /user-api/upload-avatar`
- Validation errors displayed inline below each input

### Login Form (`Loginpage.jsx`)
- Fields: `email`, `password`
- Google OAuth: `<GoogleLogin>` from `@react-oauth/google` — on success, credential token passed to `googleLogin()` store action
- Error messages from store's `error` field displayed as alerts

### Card Modal (`Modal.jsx`)
- Inline editable fields: title, description, status, priority, labels, dueDate, assignees
- All changes fire `PUT /card-api/updateCard/:id` immediately on blur/change
- File attachment upload via `<input type="file" multiple>` → `FormData` → `POST /card-api/attachments/:cardId`

### Invite Modal (`InviteModal.jsx`)
- Tab 1: Email invite — searches users via `GET /user-api/search` with debounce, submits to `POST /board-api/invite/email/:boardId`
- Tab 2: Link invite — calls `POST /board-api/invite/link/:boardId`, displays copyable token URL

---

## Security Matrix (Client-Side)

| Mechanism | Implementation | File |
|---|---|---|
| **Route Guard** | `ProtectedRoute` calls `verifySession()` on every protected route mount | `ProtectedRoute.jsx` |
| **Cookie Auth** | All `axios` calls include `{ withCredentials: true }` to send HttpOnly cookie | All store actions |
| **Token Exposure** | JWT is NEVER stored in `localStorage` or `sessionStorage` | `AuthContext.js` |
| **401 Auto-Logout** | `clearAuth()` resets state if session expires mid-session | `AuthContext.js` |
| **XSS Prevention** | No use of `dangerouslySetInnerHTML`; all user content is rendered as text nodes | All components |
| **CSRF Mitigation** | `SameSite` cookie policy + CORS `credentials: true` handled by the server | Server config |

---

## Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:4001       # Base URL of your Express server
VITE_GOOGLE_CLIENT_ID=your_client_id    # Google Cloud OAuth 2.0 Client ID
```

> All Vite env variables **must** be prefixed with `VITE_` to be exposed to the browser bundle.

---

## Local Developer Setup — Step by Step

### Prerequisites
- Node.js ≥ 18 (`node -v` to check)
- npm ≥ 9 (`npm -v` to check)

### Step 1 — Navigate to the client directory

```bash
cd task-managerr/client
```

### Step 2 — Install all dependencies

```bash
npm install
```

This installs all packages listed in `package.json` into `node_modules/`.

### Step 3 — Configure environment variables

```bash
cp envexample.txt .env
```

Open `.env` and fill in:

```env
VITE_API_URL=http://localhost:4001
VITE_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
```

To get `VITE_GOOGLE_CLIENT_ID`:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add `http://localhost:5173` as an Authorized JavaScript Origin
5. Copy the Client ID

### Step 4 — Start the development server

```bash
npm run dev
```

Vite will start on `http://localhost:5173` with Hot Module Replacement enabled.

### Step 5 — Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Compile and bundle for production into `dist/` |
| Preview | `npm run preview` | Locally preview the production build |
| Lint | `npm run lint` | Run ESLint across all source files |

### Step 6 — Production Build

```bash
npm run build
```

The output is written to `client/dist/`. Deploy this folder to Vercel, Netlify, or any static hosting provider.

Set the following environment variable on your hosting platform:
```
VITE_API_URL=https://your-render-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=<same as above>
```

> On Vercel: Settings → Environment Variables  
> On Netlify: Site Settings → Build & Deploy → Environment

---

## Vite Configuration

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- `@vitejs/plugin-react` — enables Fast Refresh and the automatic JSX runtime
- `@tailwindcss/vite` — processes Tailwind v4 directives without a separate PostCSS config
