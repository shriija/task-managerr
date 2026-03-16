import exp from "express";
import { Schema, model } from "mongoose";

//Activity Schema
const activitySchema = new Schema(
  {
    board: {},
    user: {},
    action: {},
    timestamp: {},
  },
  {},
);

export const Activity = model("activity", activitySchema);
