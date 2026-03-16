import exp from 'express'
import {config} from 'dotenv'
import connectDB from './config/db.js'
import UserApi from './Apis/UserApi.js'
import CookieParser from 'cookie-parser'
export const app = exp()
config()
app.use(exp.json())
app.use(CookieParser())
app.use('/user-api',UserApi)
await connectDB()
app.listen(process.env.PORT,()=>{
    console.log("server is running on port 4001")
})