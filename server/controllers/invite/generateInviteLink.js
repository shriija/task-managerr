import { randomUUID } from "crypto";
import { BoardModel } from '../../models/Board.js';
import { InviteTokenModel } from '../../models/InviteToken.js';

// Creates (or re-uses an existing valid) InviteToken for the board.
export const generateInviteLink = async (req, res) => {
  try {
    const { boardId } = req.params;
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // Find the board
    const board = await BoardModel.findById(boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Only the board owner can generate the link
    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the board owner can generate invite links" });
    }

    // Re-use existing valid token if it exists
    const existing = await InviteTokenModel.findOne({
      boardId,
      expiresAt: { $gt: new Date() },
    });

    if (existing) {
      const link = `${clientUrl}/invite/${existing.token}`;
      return res.status(200).json({ message: "Invite link", payload: { link, token: existing.token } });
    }

    // Generate a new token
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await InviteTokenModel.create({ boardId, token, createdBy: req.userId, expiresAt });

    const link = `${clientUrl}/invite/${token}`;
    res.status(201).json({ message: "Invite link created", payload: { link, token } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
