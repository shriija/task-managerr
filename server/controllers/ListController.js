import { ListModel } from '../models/List.js';
import { CardModel } from '../models/Card.js';
import { logActivity } from '../utils/activityLogger.js';

/**
 * Add a new List to a Board
 * 
 * @param {Object} req - Express request object containing title, board ID, and position
 * @param {Object} res - Express response object
 */
export const AddList = async (req, res) => {
    const listInfo = req.body;
    const { title, board, position } = req.body;
    try {
        // Validate payload against schema before attempting to save
        await ListModel.validate(listInfo);

        const list = new ListModel({
            title: title,
            board: board,
            position: position
        });

        await list.save();
        
        // Log the list creation in the board's activity history
        await logActivity(board, req.userId, `created list "${title}"`);
        
        res.status(201).json({ message: "list created", payload: list });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Soft Delete a List
 * Moves the list to the trash by setting isDeleted to true. Does not permanently remove cards.
 */
export const deleteList = async (req, res) => {
    try {
        const listId = req.params.id;
        
        // Update the deleted flag and record the timestamp
        const response = await ListModel.findByIdAndUpdate(
            listId,
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );
        
        if (!response) {
            return res.status(404).json({ message: "list not found" });
        }
        
        // Log the deletion activity
        await logActivity(response.board, req.userId, `deleted list "${response.title}"`);
        
        res.status(200).json({ message: "list deleted (soft delete)", payload: response });
    } catch (error) {
        res.status(500).json({ message: "Could not delete list", error: error.message });
    }
};

/**
 * Fetch a single List by ID (only if not soft-deleted)
 */
export const getList = async (req, res) => {
    try {
        const listId = req.params.id;
        const response = await ListModel.findOne({ _id: listId, isDeleted: { $ne: true } });
        
        if (!response) {
            return res.status(404).json({ message: "list not found" });
        }
        
        res.status(200).json({ message: "list found", payload: response });
    } catch (error) {
        res.status(500).json({ message: "Could not fetch list", error: error.message });
    }
};

/**
 * Get all active (non-deleted) lists for a specific board
 * Returns them sorted horizontally by their `position` property.
 */
export const getListsByBoard = async (req, res) => {
  try {
    const lists = await ListModel.find({
      board: req.params.boardId,
      isDeleted: { $ne: true }
    }).sort({ position: 1 }); // Ascending order (0 is left-most)

    res.json({ message: "Lists fetched", payload: lists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update List details (e.g., Change list title)
 */
export const updateList = async (req, res) => {
  const listId = req.params.id;
  const { title } = req.body;
  try {
    const oldList = await ListModel.findById(listId);
    const updatedList = await ListModel.findByIdAndUpdate(listId, { title }, { new: true });
    
    // Log the rename activity if the title actually changed
    if (updatedList && oldList && oldList.title !== title) {
      await logActivity(updatedList.board, req.userId, `renamed list "${oldList.title}" to "${title}"`);
    }
    
    res.status(200).json({ message: "List updated successfully", payload: updatedList });
  } catch (error) {
    res.status(500).json({ message: "Could not update list", error: error.message });
  }
};

/**
 * Trash Management: Get all soft-deleted lists for a specific board
 */
export const getDeletedLists = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const deletedLists = await ListModel.find({
            board: boardId,
            isDeleted: true
        });
        res.status(200).json({ message: "Deleted lists fetched", payload: deletedLists });
    } catch (error) {
        res.status(500).json({ message: "Could not fetch deleted lists", error: error.message });
    }
};

/**
 * Trash Management: Restore a soft-deleted list back to the active board
 */
export const restoreList = async (req, res) => {
    try {
        const listId = req.params.id;
        const restoredList = await ListModel.findByIdAndUpdate(
            listId,
            { isDeleted: false, deletedAt: null },
            { new: true }
        );
        
        if (restoredList) {
            await logActivity(restoredList.board, req.userId, `restored list "${restoredList.title}"`);
            res.status(200).json({ message: "List restored", payload: restoredList });
        } else {
            res.status(404).json({ message: "List not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Could not restore list", error: error.message });
    }
};

/**
 * Trash Management: Permanently delete a list and cascade-delete all its cards
 */
export const permanentDeleteList = async (req, res) => {
    try {
        const listId = req.params.id;
        const deletedList = await ListModel.findByIdAndDelete(listId);
        
        if (deletedList) {
            // Cascade delete: Remove all cards belonging to this list
            await CardModel.deleteMany({ list: listId });
            
            await logActivity(deletedList.board, req.userId, `permanently deleted list "${deletedList.title}"`);
            res.status(200).json({ message: "List permanently deleted", payload: deletedList });
        } else {
            res.status(404).json({ message: "List not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Could not permanently delete list", error: error.message });
    }
};