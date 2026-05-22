import multer from "multer";
import { storage } from "./storage.js";
import { imageFilter, generalFilter } from "./filters.js";

// Single avatar image upload (max 5MB)
export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("avatar");

// Multiple file upload (max 5 files, max 10MB each)
export const uploadFiles = multer({
  storage,
  fileFilter: generalFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("files", 5);
