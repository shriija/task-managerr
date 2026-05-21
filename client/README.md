# 🖥️ Client — React Frontend Documentation

A **React 19 + Vite 7** single-page application with **Zustand** state management, **TailwindCSS v4** styling, **Socket.IO** real-time integration, and **React Hook Form** for validated forms.

---

## 📦 Packages

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | UI component library |
| `react-dom` | ^19.2.0 | React DOM renderer |
| `react-router` | ^7.13.1 | Client-side routing |
| `zustand` | ^5.0.12 | Lightweight global state management |
| `axios` | ^1.13.6 | HTTP client for API calls |
| `react-hook-form` | ^7.71.2 | Form state management and validation |
| `react-hot-toast` | ^2.6.0 | Toast notification system |
| `socket.io-client` | ^4.8.3 | Real-time WebSocket client |
| `tailwindcss` | ^4.2.1 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.2.1 | Vite plugin for Tailwind CSS v4 |
| `@fullcalendar/react` | ^6.1.20 | Calendar view component |
| `@fullcalendar/core` | ^6.1.20 | FullCalendar core engine |
| `@fullcalendar/daygrid` | ^6.1.20 | Month/week day-grid view |
| `@fullcalendar/timegrid` | ^6.1.20 | Time-grid view (hourly) |
| `@fullcalendar/interaction` | ^6.1.20 | Drag, drop & click interaction |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.3.1 | Build tool & dev server |
| `@vitejs/plugin-react` | ^5.1.1 | React Fast Refresh + JSX transform |
| `eslint` | ^9.39.1 | JavaScript linter |
| `eslint-plugin-react-hooks` | ^7.0.1 | Lint React hooks rules |
| `eslint-plugin-react-refresh` | ^0.4.24 | Lint Fast Refresh compatibility |
| `@eslint/js` | ^9.39.1 | ESLint JS config |
| `@types/react` | ^19.2.7 | TypeScript types for React |
| `@types/react-dom` | ^19.2.3 | TypeScript types for React DOM |
| `globals` | ^16.5.0 | Browser/Node global variables for ESLint |

---

## 🚀 Project Setup — Step by Step

### Step 1 — Create the Vite + React project

```bash
npm create vite@latest client -- --template react
cd client
```

### Step 2 — Install all dependencies

```bash
# Core packages
npm install react-router zustand axios react-hook-form react-hot-toast socket.io-client

# Tailwind CSS v4 (Vite plugin)
npm install tailwindcss @tailwindcss/vite

# FullCalendar
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

### Step 3 — Configure Tailwind CSS v4 in vite.config.js

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Step 4 — Add Tailwind import to index.css

```css
/* src/index.css */
@import "tailwindcss";
```

### Step 5 — Set up environment variables

Create a `.env` file in the `client/` root:

```env
VITE_API_URL=http://localhost:4001
```

### Step 6 — Create the API base URL service

```js
// src/services/api.js
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";
```

### Step 7 — Start development server

```bash
npm run dev
# App runs at http://localhost:5173

# Expose on local network (for mobile testing)
npm run dev -- --host
```

---

## 🎨 Design System & Layout Structure

### Color Palette

The app uses Tailwind CSS v4 with utility classes. Core design tokens used throughout:

| Token | Usage |
|-------|-------|
| `bg-gray-900` / `bg-gray-800` | Primary dark backgrounds |
| `bg-gray-700` / `bg-gray-600` | Card / panel backgrounds |
| `text-white` / `text-gray-200` | Primary text |
| `text-gray-400` / `text-gray-500` | Muted / secondary text |
| `bg-blue-600` / `hover:bg-blue-700` | Primary action buttons |
| `bg-red-600` / `hover:bg-red-700` | Destructive actions |
| `border-gray-600` / `border-gray-700` | UI borders and dividers |

### Layout Structure

```
RootLayout
└── Navbar (persistent top bar)
    └── <Outlet> (page content)
        ├── Home (/)
        ├── LoginPage (/login)
        ├── RegisterPage (/register)
        ├── UserDashboard (/dashboard)
        │   └── TrashView (modal overlay)
        ├── CreateBoardPage (/create-board)
        ├── BoardPage (/board/:id)
        │   ├── List (×N)
        │   │   └── Card (×N)
        │   ├── InviteModal
        │   ├── MembersModal
        │   ├── CalendarView
        │   └── TrashView
        ├── AcceptInvitePage (/invite/accept/:token)
        └── AccountManagementPage
```

### Responsive Breakpoints

| Breakpoint | Usage |
|-----------|-------|
| `sm:` (640px) | Mobile → tablet transitions |
| `md:` (768px) | Single → multi-column layouts |
| `lg:` (1024px) | Full desktop board view |

### Security Matrix (Route Protection)

| Route | Guard | Redirect |
|-------|-------|---------|
| `/dashboard` | `ProtectedRoute` — requires valid JWT session | `/login` |
| `/board/:id` | `ProtectedRoute` + board membership check | `/dashboard` |
| `/create-board` | `ProtectedRoute` | `/login` |
| `/login`, `/register` | Redirect if already authenticated | `/dashboard` |
| `/invite/accept/:token` | `ProtectedRoute` — JWT + invite token validation | `/login` |

---

## ⚛️ React UI Components

All components live in `src/components/`.

### `Navbar.jsx`
- Persistent top navigation bar
- Displays app logo, user avatar, logout button
- Reads user from `AuthContext`
- Shows online status indicators

### `ProtectedRoute.jsx`
- Wraps sensitive routes
- Calls `GET /user-api/verify` on mount to validate session
- Renders `<Navigate to="/login" />` if unauthenticated

### `Board.jsx`
- Board thumbnail card displayed on the UserDashboard
- Shows board title, background color, owner info
- Navigates to `/board/:id` on click

### `List.jsx`
- Kanban list column component
- Contains a vertical stack of `Card` components
- Inline title editing (double-click to activate)
- Add Card form (inline input at the bottom)
- Drag target for card drop events
- Soft-delete list action (trash icon)

**State managed:**
- `isEditingTitle` — inline title edit mode
- `showAddCard` — toggles inline card creation form
- `newCardTitle` — controlled input for new card

### `Card.jsx`
- Individual task card in a list column
- Displays: title, priority badge, due date, assignee avatar, status chip
- Drag source for drag-and-drop movement
- Click to open `Modal.jsx` (full card detail view)
- Priority color codes: `High` → red, `Medium` → yellow, `Low` → green

### `Modal.jsx`
- Full-screen card detail editor
- Inline editable fields: title, description (textarea), due date (date picker), priority (select), status (select)
- Assignee search with debounced `GET /user-api/search?q=` calls
- Multiple-assignee support (board setting: `allowMultipleAssignees`)
- Role-based field locking: Members can only edit `status`

**State managed:**
- `editTitle`, `editDesc`, `editDueDate`, `editPriority`, `editStatus`
- `searchQuery`, `searchResults`, `showSearch`
- `isSaving` — optimistic save state

### `CalendarView.jsx`
- Full calendar view powered by FullCalendar
- Renders cards with `dueDate` as calendar events
- Day-grid and time-grid view switching
- Click event to open card Modal
- Drag event on calendar to update `dueDate`

### `InviteModal.jsx`
- Tabbed interface: **Email Invite** | **Link Invite**
- Email tab: search registered users by name/email, send invite
- Link tab: generates a shareable `/invite/accept/:token` URL with copy button
- Role selection (future-ready field)

### `MembersModal.jsx`
- Lists all board members with role badges (Owner / Admin / Member)
- Owner can promote members to Admin, demote Admins, or remove members
- Calls `PUT /board-api/manage-member/:boardId`

### `TrashView.jsx`
- Slide-in panel accessible from Dashboard and BoardPage
- Three tabs: **Boards** | **Lists** | **Cards**
- Each item shows name, deletion date, restore and permanent delete buttons
- Calls Zustand trash actions: `fetchDeletedBoards`, `restoreBoard`, `permanentDeleteBoard`, etc.

---

## 📄 Pages

All pages live in `src/pages/`.

### `Home.jsx` — `/`
- Landing page for unauthenticated users
- CTA buttons linking to Login and Register

### `LoginPage.jsx` — `/login`
- `react-hook-form` controlled form
- **Fields**: `email` (required, email format), `password` (required, min 6 chars)
- **Validation**: inline error messages below inputs
- On success: stores user in `AuthContext`, redirects to `/dashboard`

### `RegisterPage.jsx` — `/register`
- **Fields**: `name` (required), `email` (required, email), `password` (required, min 6), `confirmPassword` (must match)
- On success: auto-login and redirect to `/dashboard`

### `UserDashboard.jsx` — `/dashboard`
- Fetches and displays user's owned boards and shared boards (two separate tabs)
- Board grid with `Board.jsx` cards
- "Create Board" button → `CreateBoardPage`
- Trash icon in header opens `TrashView`

### `CreateBoardPage.jsx` — `/create-board`
- Form to create a new board
- **Fields**: `title` (required), `background` (color picker)
- Calls `POST /board-api/addBoard`

### `BoardPage.jsx` — `/board/:id`
- Main Kanban board view
- Fetches board + lists + cards via `useBoardStore.fetchBoard(id)`
- Horizontal scrollable list layout
- Drag-and-drop via native HTML5 drag events → `useBoardStore.moveCard()`
- Board settings panel (owner/admin only): edit title, toggle `allowMultipleAssignees`
- Member avatar row with online presence indicators
- Header action buttons: Invite, Members, Calendar, Trash

### `AcceptInvitePage.jsx` — `/invite/accept/:token`
- Reads `:token` from URL params
- Calls `GET /board-api/invite/accept/:token`
- On success: redirects user to the accepted board
- On error: shows rejection message

### `RootLayout.jsx`
- Wraps all pages with `<Navbar />` and `<Outlet />`

---

## 🗃️ Zustand Store — Actions, Lifecycle, and Data Flows

The store is defined in `src/context/BoardContext.js` using `zustand`'s `create()`.

### State Shape

```js
{
  board: null,           // Current board object (populated by fetchBoard)
  lists: [],             // Lists with embedded cards array
  loading: false,        // Global loading flag
  error: null,           // Error message string
  onlineUsers: [],       // Socket-provided online user IDs

  // Trash state
  deletedBoards: [],
  deletedLists: [],
  deletedCards: [],
}
```

### Actions Reference

#### Board Actions

| Action | Signature | Trigger |
|--------|-----------|---------|
| `fetchBoard` | `(boardId)` | BoardPage `useEffect` on mount |
| `reset` | `()` | BoardPage `useEffect` cleanup on unmount |
| `updateBoardSettings` | `(boardId, updates)` | Board settings panel save |
| `manageBoardMember` | `(boardId, memberId, action)` | MembersModal promote/demote/remove |
| `inviteByEmail` | `(boardId, email)` | InviteModal email tab submit |
| `generateInviteLink` | `(boardId)` | InviteModal link tab |

#### List Actions

| Action | Signature | Trigger |
|--------|-----------|---------|
| `addList` | `(boardId, title)` | "Add List" form submit |
| `updateListTitle` | `(listId, newTitle)` | List inline edit blur |
| `deleteList` | `(listId)` | List trash icon click |

#### Card Actions

| Action | Signature | Trigger |
|--------|-----------|---------|
| `addCard` | `(listId, title, additionalFields)` | List card form submit |
| `updateCard` | `(cardId, listId, updates)` | Modal save button |
| `deleteCard` | `(cardId, listId)` | Card trash icon / Modal delete |
| `moveCard` | `(cardId, fromListId, toListId, newPosition)` | Card drag-and-drop drop event |

#### Trash Actions

| Action | Signature | Trigger |
|--------|-----------|---------|
| `fetchDeletedBoards` | `()` | TrashView mount |
| `restoreBoard` | `(boardId)` | TrashView restore button |
| `permanentDeleteBoard` | `(boardId)` | TrashView permanent delete button |
| `fetchDeletedListsAndCards` | `(boardId)` | TrashView mount (BoardPage context) |
| `restoreList` | `(listId, boardId)` | TrashView restore list |
| `permanentDeleteList` | `(listId)` | TrashView permanent delete list |
| `restoreCard` | `(cardId, boardId)` | TrashView restore card |
| `permanentDeleteCard` | `(cardId)` | TrashView permanent delete card |

### Lifecycle Flow

```
BoardPage mounts
  → useEffect → fetchBoard(boardId)
      → GET /board-api/:id          → set({ board })
      → GET /list-api/getLists/:id  → set({ lists })
      → GET /card-api/getCards/:listId (parallel) → set({ lists: listsWithCards })
  → setupSocket(socket)
      → Registers all socket event listeners
BoardPage unmounts
  → reset() → leaveBoard socket event → clear state
```

### Optimistic Updates Pattern

List and Card mutations use **optimistic UI**:
1. Immediately update local Zustand state
2. Fire async API call in background
3. On success: replace temp ID with real server ID
4. On failure: rollback the optimistic state change

---

## 🌐 Axios Setup, Interceptors & Endpoints

### Base Configuration

`src/services/api.js` exports the API base URL:

```js
export const API_URL = "http://localhost:4001";
```

All Axios calls across the store use:

```js
axios.get(`${API}/endpoint`, { withCredentials: true })
```

> `withCredentials: true` is **required** on every request — this sends the HttpOnly `token` cookie with each request for authentication.

### Global Response Interceptors

Currently interceptors are not defined globally — all error handling is done inline in each Zustand action's `catch` block. To add a global interceptor:

```js
// Recommended addition to src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### Endpoints Used by the Client

#### Auth Endpoints

| Method | Endpoint | Payload | Description |
|--------|----------|---------|-------------|
| `POST` | `/user-api/signup` | `{ name, email, password }` | Register new user |
| `POST` | `/user-api/signin` | `{ email, password }` | Login — sets JWT cookie |
| `POST` | `/user-api/logout` | — | Clears JWT cookie |
| `GET` | `/user-api/verify` | — | Validate session on app load |
| `GET` | `/user-api/search?q=` | — | Search users for invite/assign |

#### Board Endpoints

| Method | Endpoint | Payload | Description |
|--------|----------|---------|-------------|
| `POST` | `/board-api/addBoard` | `{ title, background }` | Create a board |
| `GET` | `/board-api/` | — | Get user's own boards |
| `GET` | `/board-api/shared/all` | — | Get boards user is member of |
| `GET` | `/board-api/:id` | — | Get single board |
| `PUT` | `/board-api/updateBoard/:id` | `{ title, allowMultipleAssignees, ... }` | Update board settings |
| `DELETE` | `/board-api/deleteBoard/:id` | — | Soft-delete a board |
| `GET` | `/board-api/trash/deleted` | — | Fetch soft-deleted boards |
| `PUT` | `/board-api/restore/:id` | — | Restore a soft-deleted board |
| `DELETE` | `/board-api/permanent/:id` | — | Permanently delete a board |
| `PUT` | `/board-api/manage-member/:boardId` | `{ memberId, action }` | Promote/demote/remove member |
| `POST` | `/board-api/invite/email/:boardId` | `{ email }` | Email invite to registered user |
| `POST` | `/board-api/invite/link/:boardId` | — | Generate invite link |
| `GET` | `/board-api/invite/accept/:token` | — | Accept invite via token |

#### List Endpoints

| Method | Endpoint | Payload | Description |
|--------|----------|---------|-------------|
| `POST` | `/list-api/addList` | `{ title, board, position }` | Create a list |
| `GET` | `/list-api/getLists/:boardId` | — | Get all lists for a board |
| `PUT` | `/list-api/updateList/:id` | `{ title }` | Rename a list |
| `DELETE` | `/list-api/deleteList/:id` | — | Soft-delete a list |
| `GET` | `/list-api/trash/deleted/:boardId` | — | Get deleted lists for a board |
| `PUT` | `/list-api/restore/:id` | — | Restore a list |
| `DELETE` | `/list-api/permanent/:id` | — | Permanently delete a list |

#### Card Endpoints

| Method | Endpoint | Payload | Description |
|--------|----------|---------|-------------|
| `POST` | `/card-api/addCard` | `{ title, list, position }` | Create a card |
| `GET` | `/card-api/getCards/:listId` | — | Get cards for a list |
| `GET` | `/card-api/getCardById/:id` | — | Get a single card |
| `PUT` | `/card-api/updateCard/:id` | `{ title, description, dueDate, priority, status, assignedTo, assignees }` | Update card fields |
| `PUT` | `/card-api/moveCard/:id` | `{ toListId, newPosition }` | Move card to different list/position |
| `DELETE` | `/card-api/deleteCards/:id` | — | Soft-delete a card |
| `GET` | `/card-api/trash/deleted/:boardId` | — | Get deleted cards for a board |
| `PUT` | `/card-api/restore/:id` | — | Restore a card |
| `DELETE` | `/card-api/permanent/:id` | — | Permanently delete a card |

---

## 🔌 Socket.IO Client

Socket service lives in `src/socket/socketService.js`.

### Emit Helpers

```js
emitCardAdded(boardId, { card, listId })
emitCardUpdated(boardId, { cardId, listId, updates, targetListId })
emitCardDeleted(boardId, { cardId, listId })
emitCardMoved(boardId, { cardId, fromListId, toListId, newPosition })
emitListAdded(boardId, { list })
emitListUpdated(boardId, { listId, title })
emitListDeleted(boardId, { listId })
leaveBoard(boardId)
```

### Setup in BoardPage

```js
// BoardPage.jsx
useEffect(() => {
  const socket = connectSocket()
  socket.emit('join-board', boardId)
  useBoardStore.getState().setupSocket(socket)
  return () => {
    socket.emit('leave-board', boardId)
    useBoardStore.getState().reset()
  }
}, [boardId])
```

---

## 🔒 Forms & Validation (React Hook Form)

### Login Form Pattern

```jsx
const { register, handleSubmit, formState: { errors } } = useForm()

<input
  {...register("email", {
    required: "Email is required",
    pattern: { value: /^\S+@\S+$/, message: "Invalid email format" }
  })}
/>
{errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
```

### Registration Form Validation Rules

| Field | Rules |
|-------|-------|
| `name` | Required |
| `email` | Required, valid email pattern |
| `password` | Required, min length 6 |
| `confirmPassword` | Must match `password` field using `watch()` |

---

## ⚙️ Environment Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4001` |

---

## 📜 Available Scripts

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run dev -- --host  # Expose on local network
npm run build        # Build production bundle → /dist
npm run preview      # Serve the production build locally
npm run lint         # Run ESLint checks
```
