import { Schema, model } from "mongoose";

/**
 * InviteToken Schema Definition
 * 
 * Manages unique tokens generated to invite users to collaborate on a Board.
 * These tokens have an expiration date to ensure security.
 */
const inviteTokenSchema = new Schema(
  {
    // The board that the token grants access to
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    // The unique, cryptographically secure token string (often sent in an email or copied as a link)
    token: {
      type: String,
      required: true,
      unique: true, // No two tokens can be identical
    },
    // The user (usually the board owner/admin) who generated the invite link
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The exact date and time when this token becomes invalid
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Export the mongoose model for querying invite tokens in controllers
export const InviteTokenModel = model("InviteToken", inviteTokenSchema);

