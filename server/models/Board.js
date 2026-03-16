import exp from "express";
import { Schema, model } from "mongoose";

//Board schema
const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: [true, "Title cannot have leading or trailing spaces"],
      maxLength: [100, "Maxlength for title is 100"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "Owner is required"],
      ref: "User",
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    background: {
      type: String,
      default: "#0052cc",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const Board = model("board", boardSchema);

// collection: boards
// Field
// Type
// Required
// Notes
// title
// String
// yes
// trim: true, maxLength: 100
// owner
// ObjectId → User
// yes
// ref: 'User' · set from JWT on create
// members
// [ObjectId → User]
// no
// default: [] · includes owner too
// background
// String
// no
// hex color or image URL · default: '#0052cc'
// createdAt
// Date
// auto
// timestamps: true
