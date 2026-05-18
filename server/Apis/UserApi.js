import exp from 'express'
import {signup,signin,logout,verifySession,searchUsers} from '../controllers/authController.js'
import verifyToken from '../utils/verifyToken.js'
const UserApi = exp.Router()

UserApi.post('/signup',signup)
UserApi.post('/signin',signin)
UserApi.post('/logout',logout)
UserApi.get('/verify', verifyToken, verifySession)
UserApi.get('/search', verifyToken, searchUsers)

export default UserApi;