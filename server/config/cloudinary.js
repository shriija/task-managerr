import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

// Load environment variables from .env file
config();

/**
 * Configure the Cloudinary SDK with credentials from environment variables.
 * This allows the application to upload images and files (avatars, attachments, remarks)
 * to the Cloudinary cloud storage securely.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // The unique Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Public API key for authentication
  api_secret: process.env.CLOUDINARY_API_SECRET, // Secret API key for secure operations
});

export default cloudinary;

