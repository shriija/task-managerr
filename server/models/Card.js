import { Schema, model } from "mongoose";

/**
 * Attachment Sub-Schema
 * 
 * Defines the structure for file attachments uploaded to Cloudinary.
 * Used for both direct card attachments and attachments within remarks.
 */
const attachmentSchema = new Schema(
  {
    name: { type: String, required: true }, // Original file name
    url: { type: String, required: true },  // Secure Cloudinary URL
    type: { type: String, default: "" },    // MIME type (e.g., application/pdf)
    size: { type: Number, default: 0 },     // File size in bytes
    publicId: { type: String, default: "" }, // Cloudinary public ID for deletion
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }, // User who uploaded
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true } // Generate object IDs for individual attachments for easy deletion
);

/**
 * Remark Sub-Schema
 * 
 * Defines the structure for comments/remarks left on a card by users.
 * Supports text and optional file attachments.
 */
const remarkSchema = new Schema(
  {
    text: { type: String, default: "" }, // Comment body
    attachments: { type: [attachmentSchema], default: [] }, // Files attached to this remark
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who wrote the remark
  },
  { timestamps: true } // Automatically manages createdAt (for UI display) and updatedAt
);

/**
 * Card Schema Definition
 * 
 * Represents a single task (card) within a list. Contains task details,
 * assignments, file attachments, and user remarks.
 */
const cardSchema = new Schema(
  {
    // The main title/heading of the task
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: [true, "Title cannot have leading or trailing spaces"],
      maxLength: [200, "Maxlength for title is 200"],
    },
    // Detailed description of the task requirements
    description: {
      type: String,
      default: "",
    },
    // Reference to the parent List this card belongs to
    list: {
      type: Schema.Types.ObjectId,
      required: [true, "List ref is required"],
      ref: "List",
      index: true,
    },
    // Array of users assigned to this task (used if allowMultipleAssignees is true)
    assignees: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    // Single user assigned to this task (used if allowMultipleAssignees is false)
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // The user who originally created the task
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Current progress status of the task
    status: {
      type: String,
      enum: ["to do", "in progress", "completed"],
      default: "to do",
    },
    // Files directly attached to this card
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    // User comments/remarks on this card
    remarks: {
      type: [remarkSchema],
      default: [],
    },
    // Deadline for the task
    dueDate: {
      type: Date,
      default: null,
    },
    // Vertical sorting position within the parent list
    position: {
      type: Number,
      required: [true, "Position is required"],
    },
    // Tags for categorization
    labels: {
      type: [String],
      default: [],
    },
    // Urgency level
    priority: {
      type: String,
      enum: ["High", "Medium", "Low", ""],
      default: "",
    },
    // Soft delete flag - true if the card is in the trash
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Timestamp for when the card was soft-deleted
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    strict: true,
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Export the mongoose model for querying cards in controllers
export const CardModel = model("Card", cardSchema);
