<<<<<<< Updated upstream
import exp from 'express';
import { signup, signin, logout, verifySession, searchUsers, uploadAvatar } from '../controllers/authController.js';
import verifyToken from '../utils/verifyToken.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../utils/upload.js';

// Create an Express router instance for user-related routes
const UserApi = exp.Router();

/**
 * Authentication Routes
 * Handle user registration, login, and session termination.
 */
UserApi.post('/signup', signup);           // Register a new user
UserApi.post('/signin', signin);           // Authenticate a user and set JWT cookie
UserApi.post('/logout', logout);           // Clear the JWT cookie to end session

/**
 * Session & User Management Routes
 * Protected routes that require a valid JWT token (via verifyToken middleware).
 */
UserApi.get('/verify', verifyToken, verifySession);     // Check if the current session/token is still valid
UserApi.get('/search', verifyToken, searchUsers);       // Search for other users by name/email (for inviting/assigning)

/**
 * Media Upload Routes
 * Handles uploading avatar images during registration.
 * Note: Does not require verifyToken because the user isn't fully registered/logged in yet when they upload their initial avatar.
 */
UserApi.post('/upload-avatar', uploadAvatarMiddleware, uploadAvatar);

export default UserApi;
=======
import exp from 'express'
import {signup,signin,logout,verifySession,searchUsers,uploadAvatar,googleSignin,updateProfile,changePassword} from '../controllers/authController.js'
import verifyToken from '../utils/verifyToken.js'
import { uploadAvatar as uploadAvatarMiddleware } from '../utils/upload.js'
const UserApi = exp.Router()

UserApi.post('/signup',signup)
UserApi.post('/signin',signin)
UserApi.post('/google-signin',googleSignin)
UserApi.post('/logout',logout)
UserApi.get('/verify', verifyToken, verifySession)
UserApi.get('/search', verifyToken, searchUsers)
UserApi.post('/upload-avatar', uploadAvatarMiddleware, uploadAvatar)
UserApi.put('/profile', verifyToken, updateProfile)
UserApi.put('/change-password', verifyToken, changePassword)

export default UserApi;
>>>>>>> Stashed changes
