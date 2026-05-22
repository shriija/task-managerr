import { BoardModel } from '../../models/Board.js';
import { UserModel } from '../../models/User.js';
import { logActivity } from '../../utils/activityLogger.js';

// Looks up the user by their login email and adds them to board.members directly.
// No email is sent.
export const inviteByEmail = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the board
    const board = await BoardModel.findById(boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Only the board owner can invite
    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the board owner can invite members" });
    }

    // Find the user by login email
    const invitee = await UserModel.findOne({ email: email.toLowerCase().trim() }).select("-password");
    if (!invitee) {
      return res.status(404).json({ message: "No account found with that email address" });
    }

    // Cannot invite yourself
    if (invitee._id.toString() === req.userId) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    // Check if already a member
    const alreadyMember = board.members.some(
      (m) => m.toString() === invitee._id.toString()
    );
    if (alreadyMember) {
      return res.status(409).json({ message: `${invitee.name} is already a member of this board` });
    }

    // Add to members
    board.members.push(invitee._id);
    await board.save();

    // Log invite activity
    await logActivity(boardId, req.userId, `added user ${invitee.name} (${invitee.email}) to the board`);

    // Return updated board with populated members
    const updatedBoard = await BoardModel.findById(boardId)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("admins", "name email avatar");

    res.status(200).json({
      message: `${invitee.name} has been added to the board`,
      payload: updatedBoard,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
