import exp from "express";
import { Schema, model } from "mongoose";

//Card schema
const cardSchema = new Schema(
  {
    title: {},
    desc: {},
    list: {},
    assignees: {},
    attachments: {},
    dueDate: {},
    position: {},
  },
  {},
);

export const Card = model("card", cardSchema);
