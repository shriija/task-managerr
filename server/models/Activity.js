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
