import exp from "express";
import { Schema, model } from "mongoose";

//Board schema
const boardSchema = new Schema(
  {
    title: {},
    owner: {},
    members: {},
    background: {},
  },
  {},
);

export const Board = model("board", boardSchema);
