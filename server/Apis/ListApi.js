import exp from 'express';
import { AddList, deleteList, getListsByBoard, getList, updateList, getDeletedLists, restoreList, permanentDeleteList } from '../controllers/ListController.js';
import verifyToken from '../utils/verifyToken.js';

// Create an Express router instance for list-related routes
const ListApp = exp.Router();

/**
 * Primary List Operations
 * Routes for creating, fetching, updating, and soft-deleting lists.
 * All routes are protected and require a valid JWT token.
 */
ListApp.post('/addList', verifyToken, AddList);                 // Create a new list inside a board
ListApp.get('/getLists/:boardId', verifyToken, getListsByBoard); // Fetch all active lists for a specific board
ListApp.get('/getListById/:id', verifyToken, getList);          // Fetch details of a specific list by its ID
ListApp.put('/updateList/:id', verifyToken, updateList);        // Update a list's details (e.g., changing its title)
ListApp.delete('/deleteList/:id', verifyToken, deleteList);     // Soft-delete a list (moves it to the trash)

/**
 * Trash & Soft-Delete Management Routes
 * Handle viewing soft-deleted lists, restoring them, or deleting them permanently.
 */
ListApp.get('/trash/deleted/:boardId', verifyToken, getDeletedLists); // Get all soft-deleted lists for a specific board
ListApp.put('/restore/:id', verifyToken, restoreList);                // Restore a soft-deleted list from the trash
ListApp.delete('/permanent/:id', verifyToken, permanentDeleteList);   // Permanently remove a list and all its cards

export default ListApp;