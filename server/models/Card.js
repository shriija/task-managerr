import { Schema, model } from "mongoose";

//Card schema
const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: [true, "Title cannot have leading or trailing spaces"],
      maxLength: [200, "Maxlength for title is 200"],
    },
    description: {
      type: String,
      default: "",
    },
    list: {
      type: Schema.Types.ObjectId,
      required: [true, "List ref is required"],
      ref: "List",
      index: true,
    },
    assignees: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    attachments: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    position: {
      type: Number,
      required: [true, "Position is required"],
    },
    labels: {
      type: [String],
      default: [],
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", ""],
      default: "",
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const CardModel = model("Card", cardSchema);
