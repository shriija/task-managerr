import { config } from "dotenv";
import {connect} from 'mongoose'
config()
const connectDB = async() =>{
    try {
        await connect(process.env.DB_URL) 
        console.log("database connected")
    } catch (error) {
        console.log(error.message)
        console.log("error in connecting DB")
        console.error("FATAL: Cannot connect to database. Exiting.")
+       process.exit(1)
    }
}
export default connectDB;
