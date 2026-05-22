import { UserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

/**
 * Handle user registration (Sign up)
 * 
 * @param {Object} req - Express request object containing user details (name, email, password, avatar)
 * @param {Object} res - Express response object
 */
export const signup = async (req, res) => {
    const user = req.body;
    
    // Check if a user with this email already exists in the database
    const response = await UserModel.findOne({ email: user.email });
    if (response) {
        return res.status(409).json({ message: "email already exists" });
    }
    
    try {
        // Run mongoose validation without saving to catch any schema errors (e.g., short password)
        await UserModel.validate(user);
        
        // Hash the plaintext password securely using bcrypt before storing
        const hashedPass = await bcrypt.hash(user.password, 8);
        
        // Create and save the new user record
        const newUser = new UserModel({
            name: user.name,
            email: user.email,
            password: hashedPass,
            avatar: user.avatar
        });
        await newUser.save();
        
        res.status(201).json({ message: "user created sucessfully" });
    } catch (error) {
        res.json({ error: error.message });
    }
};

/**
 * Handle user authentication (Sign in)
 * 
 * @param {Object} req - Express request object containing email and password
 * @param {Object} res - Express response object
 */
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Look up the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        // Compare the provided plaintext password against the stored hashed password
        const response = await bcrypt.compare(password, user.password);
        if (!response) {
            return res.status(401).json({ message: "invalid credentials" });
        }
        
        // Remove the password field before sending the user data back to the client
        const userObj = user.toObject();
        delete userObj.password;
        
        // Generate a signed JWT token for the session
        const token = generateToken(user);
        
        // Set the JWT as a secure, HTTP-only cookie.
        // `partitioned: true` and `sameSite: "none"` are required for cross-site cookie delivery (like frontend on Vercel, backend on Render)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: true,
            sameSite: "none",
            partitioned: true 
        });
        
        res.status(200).json({ message: "signin sucessfull", payload: userObj });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Handle user logout
 * 
 * Clears the JWT cookie to terminate the session.
 */
export const logout = async (req, res) => {
    try {
        // Clear the cookie by overwriting it with an empty value and expired date
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true
        });
        res.status(200).json({ message: "logout success" });
    } catch (error) {
        res.status(201).json({ error: error.message });
    }
};

/**
 * Verify if the current session (JWT cookie) is still valid.
 * Used on frontend app load to keep the user logged in without requiring them to sign in again.
 */
export const verifySession = async (req, res) => {
    try {
        // Look up the user by the ID extracted from the token by the verifyToken middleware
        const user = await UserModel.findById(req.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        res.json({ message: "Session valid", payload: user });
    } catch (error) {
        res.status(401).json({ message: "Session invalid" });
    }
};

/**
 * Search users by name or email.
 * Used when trying to add members/assignees to a board or task.
 */
export const searchUsers = async (req, res) => {
    const { q } = req.query; // Query string parameter (e.g., ?q=john)
    try {
        if (!q) {
            return res.json({ payload: [] });
        }
        
        // Find users matching the search term using case-insensitive regex
        const users = await UserModel.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).select('-password').limit(20); // Limit results to 20 for performance
        
        res.json({ payload: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Upload avatar image to Cloudinary during registration.
 * Streams the file buffer directly from memory to Cloudinary to save disk space.
 */
export const uploadAvatar = async (req, res) => {
    try {
        // Ensure multer actually caught a file
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Dynamically import cloudinary config
        const { default: cloudinary } = await import("../config/cloudinary.js");

        // Use a Promise to wrap the callback-based Cloudinary stream upload
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "task-manager/avatars", // Cloudinary folder
                    transformation: [
                        // Force a 256x256 square crop centered on the user's face
                        { width: 256, height: 256, crop: "fill", gravity: "face" },
                        // Optimize quality and format automatically
                        { quality: "auto", fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            
            // Pipe the multer memory buffer into the Cloudinary upload stream
            stream.end(req.file.buffer);
        });

        // Return the secure HTTPS URL of the uploaded image to the frontend
        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: "Avatar upload failed", error: error.message });
    }
};