import { Activity } from "../models/Activity.js";

/**
 * Log a user action on a board
 * @param {string} boardId - The ID of the board
 * @param {string} userId - The ID of the user performing the action
 * @param {string} action - Description of the action
 */
export const logActivity = async (boardId, userId, action) => {
  try {
    if (!boardId || !userId || !action) return;
    await Activity.create({
      board: boardId,
      user: userId,
      action
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
