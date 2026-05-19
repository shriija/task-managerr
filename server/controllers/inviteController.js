import { randomUUID } from "crypto";
import { BoardModel } from "../models/Board.js";
import { UserModel } from "../models/User.js";
import { InviteTokenModel } from "../models/InviteToken.js";

// ── 1. Invite by registered email ─────────────────────────────
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

    // Return updated board with populated members
    const updatedBoard = await BoardModel.findById(boardId)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    res.status(200).json({
      message: `${invitee.name} has been added to the board`,
      payload: updatedBoard,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── 2. Generate a shareable invite link ────────────────────────
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

// ── 3. Accept an invite link ───────────────────────────────────
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

    res.status(200).json({
      message: "You have joined the board!",
      payload: { boardId: board._id, alreadyMember: false },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
