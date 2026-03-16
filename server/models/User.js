import { Schema, model } from "mongoose";

//User Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
  },
  { strict: true, timestamps: true },
);

export const UserModel = model("User", userSchema);
