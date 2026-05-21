import exp from 'express'
import {signup,signin,logout,verifySession,updateUserProfile,updatePassword} from '../controllers/authController.js'
import verifyToken from '../utils/verifyToken.js'
const UserApi = exp.Router()

UserApi.post('/signup',signup)
UserApi.post('/signin',signin)
UserApi.post('/logout',logout)
UserApi.get('/verify', verifyToken, verifySession)
UserApi.put('/update-profile', verifyToken, updateUserProfile)
UserApi.put('/update-password', verifyToken, updatePassword)

export default UserApi;