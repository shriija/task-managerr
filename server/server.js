import exp from 'express'
import {config} from 'dotenv'
import connectDB from './config/db.js'
export const app = exp()
config()
app.use(exp.json())

await connectDB()
app.listen(process.env.PORT,()=>{
    console.log("server is running on port 4001")
})