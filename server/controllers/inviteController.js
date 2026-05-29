import { randomUUID } from "crypto";
import { BoardModel } from "../models/Board.js";
import { UserModel } from "../models/User.js";
import { InviteTokenModel } from "../models/InviteToken.js";
import { logActivity } from "../utils/activityLogger.js";

/**
 * ── 1. Invite by registered email ─────────────────────────────
 * Looks up a user by their registered email address and adds them directly to the board's members list.
 * This does not send a physical email; it instantly adds them if the account exists.
 * 
 * @param {Object} req - Express request object containing boardId (params) and email (body)
 * @param {Object} res - Express response object
 */
export const inviteByEmail = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Ensure the board exists and hasn't been soft-deleted
    const board = await BoardModel.findById(boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Security Check: Only the board owner has permission to invite new members
    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the board owner can invite members" });
    }

    // Lookup the invitee by email (case-insensitive and trimmed)
    const invitee = await UserModel.findOne({ email: email.toLowerCase().trim() }).select("-password");
    if (!invitee) {
      return res.status(404).json({ message: "No account found with that email address" });
    }

    // Prevent the owner from inviting themselves
    if (invitee._id.toString() === req.userId) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    // Check if the user is already in the board's member list
    const alreadyMember = board.members.some(
      (m) => m.toString() === invitee._id.toString()
    );
    if (alreadyMember) {
      return res.status(409).json({ message: `${invitee.name} is already a member of this board` });
    }

    // Add the user's ObjectId to the board's members array and save
    board.members.push(invitee._id);
    await board.save();

    // Log this action to the board's activity history
    await logActivity(boardId, req.userId, `added user ${invitee.name} (${invitee.email}) to the board`);

    // Fetch the updated board and populate the user details for the frontend to render the new member
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

/**
 * ── 2. Generate a shareable invite link ────────────────────────
 * Creates a unique, time-limited token that anyone with an account can use to join the board.
 * If a valid, unexpired token already exists, it reuses it instead of cluttering the DB.
 * 
 * @param {Object} req - Express request object containing boardId (params)
 * @param {Object} res - Express response object
 */
export const generateInviteLink = async (req, res) => {
  try {
    const { boardId } = req.params;
    // Fallback to localhost if CLIENT_URL is not set in production
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // Validate the board exists
    const board = await BoardModel.findById(boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Security Check: Only the owner can generate public invite links
    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the board owner can generate invite links" });
    }

    // Check the database for an existing token that hasn't expired yet
    const existing = await InviteTokenModel.findOne({
      boardId,
      expiresAt: { $gt: new Date() },
    });

    // If a valid token exists, return it immediately
    if (existing) {
      const link = `${clientUrl}/invite/${existing.token}`;
      return res.status(200).json({ message: "Invite link", payload: { link, token: existing.token } });
    }

    // Otherwise, generate a brand new token using crypto.randomUUID()
    const token = randomUUID();
    // Set expiration to configurable days from now
    const inviteDays = parseInt(process.env.INVITE_LINK_EXPIRES_DAYS) || 7;
    const expiresAt = new Date(Date.now() + inviteDays * 24 * 60 * 60 * 1000); 

    // Save the new token to the database
    await InviteTokenModel.create({ boardId, token, createdBy: req.userId, expiresAt });

    const link = `${clientUrl}/invite/${token}`;
    res.status(201).json({ message: "Invite link created", payload: { link, token } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ── 3. Accept an invite link ───────────────────────────────────
 * Validates an invite token and adds the currently authenticated user to the board.
 * 
 * @param {Object} req - Express request object containing token (params)
 * @param {Object} res - Express response object
 */
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    // Look up the token in the database
    const invite = await InviteTokenModel.findOne({ token });
    if (!invite) {
      return res.status(404).json({ message: "Invalid invite link" });
    }

    // Ensure the token hasn't expired
    if (invite.expiresAt < new Date()) {
      return res.status(410).json({ message: "This invite link has expired" });
    }

    // Ensure the board still exists
    const board = await BoardModel.findById(invite.boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board no longer exists" });
    }

    // Check if the user trying to join is already a member or the owner
    const isOwner = board.owner.toString() === req.userId;
    const isMember = board.members.some((m) => m.toString() === req.userId);

    if (isOwner || isMember) {
      // User is already in the board — no changes needed, just redirect them
      return res.status(200).json({
        message: "You are already a member of this board",
        payload: { boardId: board._id, alreadyMember: true },
      });
    }

    // Check if the user already has a pending join request
    const alreadyRequested = board.pendingRequests.some(
      (r) => r.user.toString() === req.userId
    );
    if (alreadyRequested) {
      return res.status(200).json({
        message: "Your join request is already pending approval",
        payload: { boardId: board._id, alreadyMember: false, pending: true },
      });
    }

    // Add the user to the board's pendingRequests array
    board.pendingRequests.push({ user: req.userId });
    await board.save();

    // Log the fact that they requested to join via a link
    await logActivity(board._id, req.userId, "requested to join the board via invite link");

    res.status(200).json({
      message: "Your request to join the board has been submitted to the owner for approval!",
      payload: { boardId: board._id, alreadyMember: false, pending: true },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ── 4. Handle a pending join request ──────────────────────────
 * Accepts or rejects a user's join request.
 * 
 * @param {Object} req - Express request object containing boardId (params), userId and action (body)
 * @param {Object} res - Express response object
 */
export const handleJoinRequest = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId, action } = req.body; // action: "accept" | "reject"

    if (!userId || !["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "userId and action ('accept' or 'reject') are required" });
    }

    // Validate the board exists
    const board = await BoardModel.findById(boardId);
    if (!board || board.isDeleted) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Security Check: Only the board owner or admins can manage join requests
    const isOwner = board.owner.toString() === req.userId;
    const isAdmin = board.admins.some((a) => a.toString() === req.userId);
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Only the board owner or admins can manage join requests" });
    }

    // Find the request in pendingRequests
    const requestIndex = board.pendingRequests.findIndex(
      (r) => r.user.toString() === userId
    );
    if (requestIndex === -1) {
      return res.status(404).json({ message: "Join request not found" });
    }

    const requester = await UserModel.findById(userId);
    const requesterName = requester ? requester.name : "User";

    if (action === "accept") {
      // Remove from pending requests
      board.pendingRequests.splice(requestIndex, 1);
      // Ensure user is not already a member
      const alreadyMember = board.members.some((m) => m.toString() === userId);
      if (!alreadyMember) {
        board.members.push(userId);
      }
      await board.save();

      await logActivity(boardId, req.userId, `accepted join request from ${requesterName}`);
    } else {
      // Reject: simply remove from pending requests
      board.pendingRequests.splice(requestIndex, 1);
      await board.save();

      await logActivity(boardId, req.userId, `rejected join request from ${requesterName}`);
    }

    // Return the updated board state populated
    const updatedBoard = await BoardModel.findById(boardId)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .populate("admins", "name email avatar")
      .populate("pendingRequests.user", "name email avatar");

    res.status(200).json({
      message: `Join request successfully ${action}ed`,
      payload: updatedBoard,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

