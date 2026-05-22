import { BoardModel } from '../../models/Board.js'
import { logActivity } from '../../utils/activityLogger.js'

export const updateBoard = async (req, res) => {
  try {
    const board = await BoardModel.findById(req.params.id);
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the board owner can update settings" });
    }
    
    const { title, allowMultipleAssignees } = req.body;
    const oldTitle = board.title;
    const oldAllowMultiple = board.allowMultipleAssignees;

    if (title !== undefined) board.title = title;
    if (allowMultipleAssignees !== undefined) board.allowMultipleAssignees = allowMultipleAssignees;
    
    await board.save();

    if (title !== undefined && title !== oldTitle) {
      await logActivity(board._id, req.userId, `renamed board to "${title}"`);
    }
    if (allowMultipleAssignees !== undefined && allowMultipleAssignees !== oldAllowMultiple) {
      await logActivity(board._id, req.userId, `${allowMultipleAssignees ? "enabled" : "disabled"} multi-assignee support`);
    }
    
    const updated = await BoardModel.findById(board._id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("admins", "name email avatar");
      
    res.json({ message: "Board updated successfully", payload: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
