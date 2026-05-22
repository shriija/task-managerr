import multer from "multer";

// Store files in memory (buffer) — we stream them to Cloudinary
export const storage = multer.memoryStorage();
