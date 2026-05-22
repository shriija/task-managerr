import { Schema, model } from "mongoose";

/**
 * Board Schema Definition
 * 
 * Represents a Kanban board in the application. A board contains multiple lists,
 * which in turn contain task cards. It manages access control via an owner, admins,
 * and members, and supports collaborative features.
 */
const boardSchema = new Schema(
  {
    // The display name of the board
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: [true, "Title cannot have leading or trailing spaces"],
      maxLength: [100, "Maxlength for title is 100"],
    },
    // The user who created or currently owns the board
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "Owner is required"],
      ref: "User",
    },
    // Standard members who can view and interact with the board
    members: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    // Admin members who have elevated privileges (e.g., managing other members or settings)
    admins: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    // Optional background color or image URL for the board UI
    background: {
      type: String,
      default: "#0052cc",
    },
    // Soft delete flag - true if the board is in the trash
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Timestamp for when the board was soft-deleted (used for auto-cleanup or UI rendering)
    deletedAt: {
      type: Date,
      default: null,
    },
    // Setting to allow tasks on this board to have multiple assignees
    allowMultipleAssignees: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: true,
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Export the mongoose model for querying boards in controllers
export const BoardModel = model("Board", boardSchema);

