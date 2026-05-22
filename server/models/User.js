import { Schema, model } from "mongoose";

/**
 * User Schema Definition
 * 
 * Defines the structure for user accounts in the MongoDB database.
 * Enforces validation for required fields, unique emails, and minimum password lengths.
 * Includes timestamps to track when accounts are created or updated.
 */
const userSchema = new Schema(
  {
    // The user's full name. Trims whitespace and ensures at least 2 characters.
    name: { type: String, required: true, trim: true, minlength: 2 },
    
    // The user's email address. Must be unique across all users and stored in lowercase.
    email: { type: String, required: true, unique: true, lowercase: true },
    
    // The hashed password for the user. (Hashed in the auth controller before saving).
    password: { type: String, required: true, minlength: 6 },
    
    // Optional URL to the user's avatar image (typically hosted on Cloudinary).
    avatar: { type: String, default: "" },
  },
  { 
    strict: true,        // Reject fields not defined in the schema
    timestamps: true     // Automatically manage createdAt and updatedAt fields
  }
);

// Export the mongoose model for querying users in controllers
export const UserModel = model("User", userSchema);

