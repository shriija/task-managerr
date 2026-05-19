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
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    cards: {
      type: [Schema.Types.ObjectId],
      ref: "Card",
      default: [],
    }, // []
  },
  {
    strict: true,
    timestamps: true,
  },
);

export const ListModel = model("List", listSchema);
