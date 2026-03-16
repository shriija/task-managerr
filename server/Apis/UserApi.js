import exp from 'express'
import {signup,signin,logout} from '../controllers/authController.js'
const UserApi = exp.Router()

UserApi.post('/signup',signup)
UserApi.post('/signin',signin)
UserApi.get('/logout/:id',logout)

export default UserApi;