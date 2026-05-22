# Audit Logs & Activity History Tracking

Implement a complete board audit/activity log history. The system will capture key operations (card creation, title updates, column movements, member assignments, settings changes) and expose them on both the client interface and a dedicated board view tab.

---

## User Review Required

> [!NOTE]
> **Proposed UI Placement**:
> We propose placing the "Activity Log" as a dedicated sub-view in the board navigation sidebar (alongside Lists, My Tasks, Calendar, and Trash). This makes it highly discoverable and groups it naturally with other board-level pages.

> [!TIP]
> **Proposed App Enhancements**:
> Along with basic audit tracking, we can implement:
> 1. **Real-time Activity Broadcasts**: Emit an event via Socket.io when an activity is logged so other collaborators see new history entries instantly.
> 2. **Activity Filtering**: Let users filter the activity logs by action category (e.g., Column movements, Assignments, Cards) or by user.

---

## Proposed Changes

### Database & Backend Utilities

#### [NEW] [activityLogger.js](file:///c:/task-managerr/server/utils/activityLogger.js)
- Build a helper `logActivity(boardId, userId, action)` to record events to the `Activity` database collection.
- Support optional Socket.io emissions to broadcast logged actions to the board room.

---

### Backend Controllers & Routing

#### [MODIFY] [boardController.js](file:///c:/task-managerr/server/controllers/boardController.js)
- Import the `Activity` model and `activityLogger`.
- Log activities for:
  - Board creation.
  - Board Title updates.
  - Member management (demotions, promotions, removals).
- Implement `getActivityLogs` controller to return list of sorted logs populated with user info.

#### [MODIFY] [BoardApi.js](file:///c:/task-managerr/server/Apis/BoardApi.js)
- Register route `GET /board-api/activity/:boardId` mapped to `getActivityLogs` with token verification middleware.

#### [MODIFY] [ListController.js](file:///c:/task-managerr/server/controllers/ListController.js)
- Log activities for:
  - List creation.
  - Title updates.
  - List soft-deletions and restores.

#### [MODIFY] [cardController.js](file:///c:/task-managerr/server/controllers/cardController.js)
- Log activities for:
  - Card creation.
  - Card title/desc updates.
  - Card movements between lists (including source and destination column context).
  - Member assignments / unassignments.
  - Card deletion and restorations.

---

### Frontend Client Integration

#### [NEW] [ActivityView.jsx](file:///c:/task-managerr/client/src/components/ActivityView.jsx)
- Build a beautiful, responsive activity feed component with:
  - Structured card items showing user avatars, formatted actions, and custom timestamp formatting.
  - Category filters (All, Cards, Columns, Members, Settings) to refine results.
  - Dynamic scroll lists.

#### [MODIFY] [BoardPage.jsx](file:///c:/task-managerr/client/src/pages/BoardPage.jsx)
- Register `"activity"` in the view states array.
- Add an "Activity Log" tab button inside the side navigation sidebar with a book/list icon.
- Dynamically render `<ActivityView />` when `currentView === "activity"`.

#### [MODIFY] [boardSocket.js](file:///c:/task-managerr/server/sockets/boardSocket.js)
- Set up a listener wrapper or pass `io` to the activity logger to broadcast activity logs under `"activity-logged"`.

#### [MODIFY] [BoardContext.js](file:///c:/task-managerr/client/src/context/BoardContext.js)
- Bind a socket listener for `"activity-logged"` to dynamically append new items to the client activity state if the user has the log feed open.

---

## Verification Plan

### Automated Tests
- Run `npm run build` in `client/` to verify code compiling successfully.

### Manual Verification
- Perform actions on the board (create card, move card, invite user, rename list).
- Click on "Activity Log" in the board sidebar and verify that all actions are displayed chronologically with the user's name and exact action detail.
- Verify filters correctly partition card events from columns and members.
