import { Schema } from "mongoose";

// Attachment sub-schema (shared by card attachments and remarks)
export const attachmentSchema = new Schema(
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
