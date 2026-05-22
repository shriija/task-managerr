import { BoardModel } from '../../models/Board.js'
import { Activity } from '../../models/Activity.js'

export const getBoardActivity = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await BoardModel.findById(boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board not found" });
    }
    
    const isOwner = board.owner.toString() === req.userId;
    const isMember = board.members.some(m => m.toString() === req.userId);
    
    if (!isOwner && !isMember) {
      return res.status(403).json({ message: "You do not have permission to view activity on this board" });
    }

    const activities = await Activity.find({ board: boardId })
      .populate("user", "name email avatar")
      .sort({ timestamp: -1 })
      .limit(100);

    res.status(200).json({ message: "Activity logs fetched", payload: activities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
