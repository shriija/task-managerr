import exp from 'express';
import { addBoard, getBoard, deleteBoard, getMyBoards, getDeletedBoards, restoreBoard, permanentDeleteBoard, updateBoard, getSharedBoards, manageMember, getBoardActivity } from '../controllers/boardController.js';
import { inviteByEmail, generateInviteLink, acceptInvite, handleJoinRequest } from '../controllers/inviteController.js';
import verifyToken from '../utils/verifyToken.js';
 
// Create an Express router instance for board-related routes
const BoardApp = exp.Router();
 
/**
 * Primary Board Operations
 * Routes for creating, fetching, and updating boards.
 * All routes are protected and require a valid JWT token.
 */
BoardApp.post('/addBoard', verifyToken, addBoard);            // Create a new board
BoardApp.get('/', verifyToken, getMyBoards);                  // Get all boards owned by the current user
BoardApp.get('/shared/all', verifyToken, getSharedBoards);    // Get all boards shared with the current user
BoardApp.put('/updateBoard/:id', verifyToken, updateBoard);   // Update board settings (title, background, etc.)
BoardApp.get('/:id', verifyToken, getBoard);                  // Get a specific board by ID (must be at the end to prevent catching other GET routes)
 
/**
 * Collaboration & Activity Routes
 */
BoardApp.put('/manage-member/:boardId', verifyToken, manageMember);     // Add/remove/update privileges for a board member
BoardApp.get('/activity/:boardId', verifyToken, getBoardActivity);      // Fetch the activity log/history for a specific board
 
/**
 * Invite System Routes
 * Handle generating and accepting invites to collaborate on a board.
 */
BoardApp.post('/invite/email/:boardId', verifyToken, inviteByEmail);      // Send an invite directly via email
BoardApp.post('/invite/link/:boardId', verifyToken, generateInviteLink);  // Generate a shareable invite link
BoardApp.get('/invite/accept/:token', verifyToken, acceptInvite);         // Process an invite acceptance via token
BoardApp.put('/invite/handle-request/:boardId', verifyToken, handleJoinRequest); // Accept or reject a user's join request

/**
 * Trash & Soft-Delete Management Routes
 * Handle moving boards to the trash, viewing the trash, and permanent deletion.
 */
BoardApp.get('/trash/deleted', verifyToken, getDeletedBoards);          // Get all soft-deleted boards for the user
BoardApp.delete('/deleteBoard/:id', verifyToken, deleteBoard);          // Soft-delete a board (move to trash)
BoardApp.put('/restore/:id', verifyToken, restoreBoard);                // Restore a soft-deleted board from the trash
BoardApp.delete('/permanent/:id', verifyToken, permanentDeleteBoard);   // Permanently remove a board and all associated data

export default BoardApp;