import multer from "multer";

// Store files in memory (buffer) — we stream them to Cloudinary
const storage = multer.memoryStorage();

// File filter: images only (for avatar uploads)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// General file filter: allow common file types
const generalFilter = (req, file, cb) => {
  const allowed = [
    "image/", "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain", "text/csv",
    "application/zip", "application/x-rar-compressed",
  ];
  const isAllowed = allowed.some(type => file.mimetype.startsWith(type));
  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported"), false);
  }
};

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
