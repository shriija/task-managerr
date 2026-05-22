import exp from "express";
import { addCard, getCards, deleteCards, getCardById, updateCard, moveCard, getDeletedCardsByBoard, restoreCard, permanentDeleteCard, uploadAttachments, deleteAttachment, addRemark, deleteRemark } from "../controllers/cardController.js";
import verifyToken from '../utils/verifyToken.js';
import { uploadFiles } from '../utils/upload.js';

// Create an Express router instance for card-related routes
const CardApp = exp.Router();

/**
 * Primary Card Operations
 * Routes for creating, fetching, updating, and soft-deleting task cards.
 * All routes are protected and require a valid JWT token.
 */
CardApp.post("/addCard", verifyToken, addCard);                 // Create a new card in a list
CardApp.get("/getCards/:id", verifyToken, getCards);            // Fetch all cards for a specific list
CardApp.get("/getCardById/:id", verifyToken, getCardById);      // Fetch details of a specific card
CardApp.put("/updateCard/:id", verifyToken, updateCard);        // Update card metadata (title, desc, status, assignees, etc.)
CardApp.put("/moveCard/:id", verifyToken, moveCard);            // Special endpoint for drag & drop (updates position & listId)
CardApp.delete("/deleteCards/:id", verifyToken, deleteCards);   // Soft-delete a card (moves it to the trash)

/**
 * Trash & Soft-Delete Management Routes
 * Handle viewing soft-deleted cards across an entire board, restoring them, or permanently deleting them.
 */
CardApp.get("/trash/deleted/:boardId", verifyToken, getDeletedCardsByBoard); // Get all soft-deleted cards for a specific board
CardApp.put("/restore/:id", verifyToken, restoreCard);                       // Restore a soft-deleted card from the trash
CardApp.delete("/permanent/:id", verifyToken, permanentDeleteCard);          // Permanently remove a card

/**
 * File Attachments Routes
 * Uses the `uploadFiles` multer middleware to handle multi-part file uploads (images, PDFs, DOCs)
 * directly to memory buffer before the controller streams them to Cloudinary.
 */
CardApp.post("/attachments/:cardId", verifyToken, uploadFiles, uploadAttachments);         // Upload new files to a card
CardApp.delete("/attachments/:cardId/:attachmentId", verifyToken, deleteAttachment);       // Delete a specific attachment

/**
 * Remarks & Comments Routes
 * Remarks can contain text and optional file attachments. 
 * The `uploadFiles` middleware handles any attached files before saving the remark text.
 */
CardApp.post("/remarks/:cardId", verifyToken, uploadFiles, addRemark);         // Post a new remark (with or without files)
CardApp.delete("/remarks/:cardId/:remarkId", verifyToken, deleteRemark);       // Delete a specific remark

export default CardApp;

