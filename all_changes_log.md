# 📝 Kanvas Task Manager — All Changes Log

> All updates made across sessions, in chronological order.  
> **Last updated:** March 24, 2026

---

## Session 1 — Core Bug Fixes & Stability

### 1. [server/controllers/authController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/authController.js)
- **Fixed:** [signup](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/authController.js#6-28) error handler was missing `await` and had no `try-catch` around validation
- **Fixed:** Mapped `profileImageUrl` → `avatar` field mismatch between frontend form and server User model

### 2. [client/src/pages/RegisterPage.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/pages/RegisterPage.jsx)
- **Fixed:** Payload now sends `avatar` instead of `profileImageUrl` to match the server schema
- **Added:** `react-hot-toast` success/error notifications on signup

### 3. [client/src/context/BoardContext.js](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js) (Zustand Store)
- **Created/Rewrote:** Built the entire Zustand store for board state management
- **Added:** Optimistic updates for all CRUD operations (add/update/delete for lists and cards)
- **Fixed:** Field name mapping — standardized `description` everywhere (was previously a mix of `desc` and `description`)
- **Added:** [moveCard](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js#258-295) action with optimistic state update for drag-and-drop
- **Added:** Socket.io listener setup ([setupSocket](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js#15-123)) for real-time sync
- **Added:** Socket listeners for: `card-moved`, `card-added`, `card-updated`, `card-deleted`, `list-added`, `list-updated`, `list-deleted`, `online-users`

### 4. [client/src/components/Modal.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/components/Modal.jsx)
- **Fixed:** [handleSave](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/components/Modal.jsx#35-44) now sends `description` instead of `desc` to match the server Card model

### 5. [server/models/Card.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/models/Card.js)
- **Added:** `priority` field to the Card schema with enum values `["High", "Medium", "Low", ""]`

### 6. [server/controllers/cardController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/cardController.js)
- **Fixed:** [getCards](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/cardController.js#36-46) now sorts by `position: 1` for correct ordering
- **Fixed:** [updateCard](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/cardController.js#47-68) now accepts and saves `priority` and `description` fields
- **Added:** [moveCard](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js#258-295) endpoint for drag-and-drop persistence

### 7. [server/Apis/CardApi.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/Apis/CardApi.js)
- **Added:** `PUT /moveCard/:id` route pointing to the new [moveCard](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js#258-295) controller
- **Added:** [verifyToken](file:///d:/TASK_MANAGEMENT/task-managerr/server/utils/verifyToken.js#3-26) middleware on **all** card routes (was missing before)

### 8. [server/Apis/ListApi.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/Apis/ListApi.js)
- **Added:** [verifyToken](file:///d:/TASK_MANAGEMENT/task-managerr/server/utils/verifyToken.js#3-26) middleware on **all** list routes (was missing before)

---

## Session 2 — Real-Time Sync & Drag-and-Drop

### 9. [server/sockets/boardSocket.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/sockets/boardSocket.js)
- **Expanded:** Added event listeners and broadcasters for:
  - `card-added` → broadcasts to board room
  - `card-updated` → broadcasts to board room
  - `card-deleted` → broadcasts to board room
  - `list-added` → broadcasts to board room
  - `list-updated` → broadcasts to board room
  - `list-deleted` → broadcasts to board room
- These were previously missing — only `move-card` existed

### 10. [client/src/socket/socketService.js](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js)
- **Created:** Centralized singleton socket connection service
- **Added:** [connectSocket()](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#8-33), [disconnectSocket()](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#34-40), [joinBoard()](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#43-50), [leaveBoard()](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#51-55)
- **Added:** Emit helpers: [emitCardAdded](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#63-67), [emitCardUpdated](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#68-72), [emitCardDeleted](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#73-77), [emitCardMoved](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#58-62), [emitListAdded](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#78-82), [emitListUpdated](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#83-87), [emitListDeleted](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js#88-92)

### 11. [client/src/pages/BoardPage.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/pages/BoardPage.jsx)
- **Added:** Socket lifecycle management — connects socket on mount, joins board room, cleans up on unmount
- **Added:** Calls [setupSocket()](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js#15-123) from the store to wire up all listeners

### 12. [client/src/components/Card.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/components/Card.jsx)
- **Rewrote:** Implemented full HTML5 drag-and-drop support
- **Added:** `draggable` attribute, `onDragStart`/`onDragEnd` handlers
- **Added:** Visual feedback — card opacity change during drag, `cursor-grab`/`cursor-grabbing`
- **Added:** Priority badges, due date badges with overdue detection
- **Added:** Description preview text, labels display, hover accent bar

### 13. [client/src/components/List.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/components/List.jsx)
- **Rewrote:** Implemented drop target functionality
- **Added:** `onDragOver`, `onDragLeave`, `onDrop` handlers
- **Added:** Precise drop position calculation using `data-card-index` and mouse Y position
- **Added:** Visual drop zone feedback — ring highlight, dashed placeholder for empty lists
- **Added:** Same-list reorder index adjustment logic

---

## Session 3 — Cascade Deletes & Move Card Fix (Today)

### 14. [server/controllers/ListController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/ListController.js)
- **Added:** `import { CardModel }` at the top
- **Added:** Cascade delete — when a list is deleted, all cards belonging to that list (`CardModel.deleteMany({ list: listId })`) are also deleted from the database

### 15. [server/controllers/boardController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/boardController.js)
- **Added:** `import { ListModel }` and `import { CardModel }` at the top
- **Added:** Cascade delete — when a board is deleted:
  1. Finds all lists belonging to that board
  2. Deletes all cards in those lists (`CardModel.deleteMany({ list: { $in: listIds } })`)
  3. Deletes all lists (`ListModel.deleteMany({ board: boardId })`)

### 16. [server/controllers/cardController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/cardController.js) — [moveCard](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js#258-295) rewrite
- **Rewrote:** The entire [moveCard](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js#258-295) function for proper drag-and-drop persistence
- **Before:** Simply updated the single card's `list` and `position` fields — caused position collisions and order bugs
- **After:** Now performs full re-sequencing:
  1. Finds the card and records its old list
  2. Moves the card to the new list
  3. Fetches all cards in the destination list, removes the moved card, re-inserts it at the exact target index
  4. Re-sequences every card's `position` field (0, 1, 2, 3...)
  5. If it was a cross-list move, also re-sequences the source list

---

## Summary Table

| # | File | Change Type | Category |
|:-:|:-----|:----------:|:--------:|
| 1 | [authController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/authController.js) | Bug fix | Auth |
| 2 | [RegisterPage.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/pages/RegisterPage.jsx) | Bug fix + Toast | Auth |
| 3 | [BoardContext.js](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/context/BoardContext.js) | New / Rewrite | State Management |
| 4 | [Modal.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/components/Modal.jsx) | Bug fix | UI |
| 5 | [Card.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/models/Card.js) (model) | Schema update | DB |
| 6 | [cardController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/cardController.js) | Bug fix + New endpoint | API |
| 7 | [CardApi.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/Apis/CardApi.js) | New route + Security | API |
| 8 | [ListApi.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/Apis/ListApi.js) | Security | API |
| 9 | [boardSocket.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/sockets/boardSocket.js) | Feature expansion | Real-time |
| 10 | [socketService.js](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/socket/socketService.js) | New file | Real-time |
| 11 | [BoardPage.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/pages/BoardPage.jsx) | Socket lifecycle | Real-time |
| 12 | [Card.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/components/Card.jsx) | Rewrite | UI / DnD |
| 13 | [List.jsx](file:///d:/TASK_MANAGEMENT/task-managerr/client/src/components/List.jsx) | Rewrite | UI / DnD |
| 14 | [ListController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/ListController.js) | Cascade delete | API |
| 15 | [boardController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/boardController.js) | Cascade delete | API |
| 16 | [cardController.js](file:///d:/TASK_MANAGEMENT/task-managerr/server/controllers/cardController.js) | moveCard rewrite | API / DnD |
