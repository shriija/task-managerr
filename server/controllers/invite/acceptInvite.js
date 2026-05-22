import { BoardModel } from '../../models/Board.js';
import { InviteTokenModel } from '../../models/InviteToken.js';
import { logActivity } from '../../utils/activityLogger.js';

// Validates the token and adds the current logged-in user to the board.
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    // Find the token
    const invite = await InviteTokenModel.findOne({ token });
    if (!invite) {
      return res.status(404).json({ message: "Invalid invite link" });
    }

    // Check expiry
    if (invite.expiresAt < new Date()) {
      return res.status(410).json({ message: "This invite link has expired" });
    }

    const board = await BoardModel.findById(invite.boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board no longer exists" });
    }

    // Check if already a member or owner
    const isOwner = board.owner.toString() === req.userId;
    const isMember = board.members.some((m) => m.toString() === req.userId);

    if (isOwner || isMember) {
      // Already in the board — just redirect
      return res.status(200).json({
        message: "You are already a member of this board",
        payload: { boardId: board._id, alreadyMember: true },
      });
    }

    // Add to members
    board.members.push(req.userId);
    await board.save();

    // Log join activity
    await logActivity(board._id, req.userId, "joined the board via invite link");

    res.status(200).json({
      message: "You have joined the board!",
      payload: { boardId: board._id, alreadyMember: false },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
