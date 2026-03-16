import exp from "express";
import { Schema, model } from "mongoose";
import { type } from "node:os";

//User Schema
const userSchema = new Schema({
  name:     { type: String, required: true, trim: true, minlength: 2 },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar:   { type: String, default: '' },
}, { timestamps: true });

export const UserModel = model("user", userSchema);
