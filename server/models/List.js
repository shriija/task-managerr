import { Schema, model } from "mongoose";

/**
 * List Schema Definition
 * 
 * Represents a vertical list (column) within a Kanban board.
 * Each list belongs to a specific board and contains multiple ordered cards.
 */
const listSchema = new Schema(
  {
    // The display title of the list (e.g., "To Do", "In Progress", "Done")
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    // Reference to the parent Board. Indexed for faster queries when loading a board.
    board: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Board",
      index: true,
    },
    // Used for sorting lists horizontally on the board UI (e.g., 0 is far left)
    position: {
      type: Number,
      default: 0,
    },
    // Soft delete flag - true if the list is in the trash
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Timestamp for when the list was soft-deleted
    deletedAt: {
      type: Date,
      default: null,
    },
    // Array of ObjectIds representing the ordered cards within this list
    cards: {
      type: [Schema.Types.ObjectId],
      ref: "Card",
      default: [],
    },
  },
  {
    strict: true,
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Export the mongoose model for querying lists in controllers
export const ListModel = model("List", listSchema);

