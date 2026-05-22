import { Schema, model } from "mongoose";

// Attachment sub-schema (shared by card attachments and remarks)
const attachmentSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: "" },
    size: { type: Number, default: 0 },
    publicId: { type: String, default: "" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Remark sub-schema
const remarkSchema = new Schema(
  {
    text: { type: String, default: "" },
    attachments: { type: [attachmentSchema], default: [] },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

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
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["to do", "in progress", "completed"],
      default: "to do",
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    remarks: {
      type: [remarkSchema],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const CardModel = model("Card", cardSchema);

