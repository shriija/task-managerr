import { BoardModel } from '../../models/Board.js'
import { UserModel } from '../../models/User.js'
import { logActivity } from '../../utils/activityLogger.js'

export const manageMember = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { memberId, action } = req.body; // action: 'remove', 'promote', 'demote'

    if (!memberId || !action) {
      return res.status(400).json({ message: "memberId and action are required" });
    }

    const board = await BoardModel.findById(boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board not found" });
    }

    const isOwner = board.owner.toString() === req.userId;
    const isAdmin = board.admins.some(a => a.toString() === req.userId);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You do not have permission to manage members on this board" });
    }

    // Check if target is Owner
    const isTargetOwner = board.owner.toString() === memberId;
    if (isTargetOwner) {
      return res.status(400).json({ message: "Cannot perform action on the board owner" });
    }

    const isTargetAdmin = board.admins.some(a => a.toString() === memberId);
    const isTargetMember = board.members.some(m => m.toString() === memberId);

    if (!isTargetMember && !isTargetAdmin) {
      return res.status(404).json({ message: "Target user is not a member of this board" });
    }

    if (action === "promote") {
      if (!isOwner) {
        return res.status(403).json({ message: "Only the board owner can promote members to admin" });
      }
      if (isTargetAdmin) {
        return res.status(400).json({ message: "User is already an admin" });
      }
      board.admins.push(memberId);
    } 
    else if (action === "demote") {
      if (!isOwner) {
        return res.status(403).json({ message: "Only the board owner can demote admins" });
      }
      if (!isTargetAdmin) {
        return res.status(400).json({ message: "User is not an admin" });
      }
      board.admins = board.admins.filter(a => a.toString() !== memberId);
    } 
    else if (action === "remove") {
      // Admins can only remove regular members (not admins)
      if (isAdmin && !isOwner) {
        if (isTargetAdmin) {
          return res.status(403).json({ message: "Admins cannot remove other admins" });
        }
      }
      // Remove from members
      board.members = board.members.filter(m => m.toString() !== memberId);
      // Remove from admins just in case
      board.admins = board.admins.filter(a => a.toString() !== memberId);
    } 
    else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await board.save();

    // Log the member update
    try {
      const memberUser = await UserModel.findById(memberId);
      const memberName = memberUser ? memberUser.name : "Unknown User";
      if (action === "promote") {
        await logActivity(boardId, req.userId, `promoted ${memberName} to Admin`);
      } else if (action === "demote") {
        await logActivity(boardId, req.userId, `demoted ${memberName} to Member`);
      } else if (action === "remove") {
        await logActivity(boardId, req.userId, `removed ${memberName} from the board`);
      }
    } catch (logErr) {
      console.error("Failed to log member update activity:", logErr);
    }

    const updatedBoard = await BoardModel.findById(boardId)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("admins", "name email avatar");

    res.status(200).json({ message: `Member updated successfully`, payload: updatedBoard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
