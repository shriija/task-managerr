import exp from 'express'
import {signup,signin,logout,verifySession,searchUsers,uploadAvatar} from '../controllers/auth/index.js'
import verifyToken from '../utils/verifyToken.js'
import { uploadAvatar as uploadAvatarMiddleware } from '../utils/upload/index.js'
const UserApi = exp.Router()

UserApi.post('/signup',signup)
UserApi.post('/signin',signin)
UserApi.post('/logout',logout)
UserApi.get('/verify', verifyToken, verifySession)
UserApi.get('/search', verifyToken, searchUsers)
UserApi.post('/upload-avatar', uploadAvatarMiddleware, uploadAvatar)

export default UserApi;