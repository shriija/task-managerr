import { Schema, model } from "mongoose";




//Activity Schema
const activitySchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      required: [true, "Board ref is required"],
      ref: "Board",
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ref is required"],
      ref: "User",
    },
    action: {
      type: String,
      required: [true, "Action is required"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const Activity = model("Activity", activitySchema);

//This schema is used for logging user activities on boards, such as creating a card, moving a card, etc. It includes references to the board and user involved, a description of the action, and a timestamp.