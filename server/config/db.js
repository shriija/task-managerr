import { config } from "dotenv";
import {app} from '../server.js'
import {connect} from 'mongoose'
config()
const connectDB = async() =>{
    try {
        await connect(process.env.DB_URL) 
        console.log("database connected")
    } catch (error) {
        console.log(error.message)
        console.log("error in connecting DB")
    }
}
export default connectDB;
