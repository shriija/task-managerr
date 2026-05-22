import multer from "multer";

/**
 * Configure multer to use memory storage.
 * Instead of writing uploaded files to the disk, multer will store them in RAM as a Buffer.
 * This is necessary because we intend to stream the files directly to Cloudinary
 * without saving them locally first.
 */
const storage = multer.memoryStorage();

/**
 * Filter function for avatar uploads.
 * Restricts uploads to image files only.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} file - The file object provided by multer.
 * @param {Function} cb - The multer callback function cb(error, acceptFile).
 */
const imageFilter = (req, file, cb) => {
  // Check if the mimetype string starts with "image/" (e.g., image/png, image/jpeg)
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files are allowed"), false); // Reject non-images
  }
};

/**
 * Filter function for general file uploads (e.g., task attachments).
 * Restricts uploads to a predefined list of common safe file types.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} file - The file object provided by multer.
 * @param {Function} cb - The multer callback function cb(error, acceptFile).
 */
const generalFilter = (req, file, cb) => {
  // List of permitted file mimetypes (images, documents, spreadsheets, archives)
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
  
  // Check if the uploaded file's mimetype matches any of the allowed patterns
  const isAllowed = allowed.some(type => file.mimetype.startsWith(type));
  if (isAllowed) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("File type not supported"), false); // Reject unsupported files
  }
};

/**
 * Multer middleware for uploading a single avatar image.
 * Uses memory storage, filters for images only, and enforces a 5MB size limit.
 * Expects a single file field named "avatar".
 */
export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max file size
}).single("avatar");

/**
 * Multer middleware for uploading multiple general files (e.g., task attachments/remarks).
 * Uses memory storage, filters for safe document/image types, and enforces a 10MB limit per file.
 * Expects an array of files in the field named "files", up to a maximum of 5 files at a time.
 */
export const uploadFiles = multer({
  storage,
  fileFilter: generalFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max file size per file
}).array("files", 5); // Allow up to 5 files simultaneously

