import { Schema, model } from "mongoose";

/**
 * Activity Schema Definition
 * 
 * Used for logging user activities and events on boards, such as creating a card, 
 * moving a card, or deleting lists. Provides an audit trail for the board's history.
 */
const activitySchema = new Schema(
  {
    // Reference to the Board where the activity occurred
    board: {
      type: Schema.Types.ObjectId,
      required: [true, "Board ref is required"],
      ref: "Board",
      index: true, // Indexed to quickly fetch all history for a specific board
    },
    // Reference to the User who performed the action
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ref is required"],
      ref: "User",
    },
    // A string description of the action (e.g., "created card 'Setup Database'")
    action: {
      type: String,
      required: [true, "Action is required"],
    },
    // When the action occurred
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

// Export the mongoose model for creating activity logs
export const Activity = model("Activity", activitySchema);