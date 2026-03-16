import exp from "express";
import { Schema, model } from "mongoose";

//List schema
const listSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    board: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Board",
      index: true,
    }, // (ref),
    position: {
      type: Number,
      required: true,
    },
    cards: {
      type: [Schema.Types.ObjectId],
      ref: "Card",
      default: [],
    }, // []
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

export const List = model("list", listSchema);
