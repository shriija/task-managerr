import { Schema } from "mongoose";
import { attachmentSchema } from "./attachmentSchema.js";

// Remark sub-schema
export const remarkSchema = new Schema(
  {
    text: { type: String, default: "" },
    attachments: { type: [attachmentSchema], default: [] },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
