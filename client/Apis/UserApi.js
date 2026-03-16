import exp from 'express'
import {signup,signin,logout} from '../controllers/authController.js'
const UserApi = exp.Router()

UserApi.post('/signup',signup)
UserApi.get('/signin',signin)

export default UserApi;