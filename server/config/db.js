import { config } from "dotenv";
import {connect} from 'mongoose'
config()
const connectDB = async() =>{
    try {
        await connect(process.env.DB_URL) 
    } catch (error) {
        // Failed to connect to database
    }
}
export default connectDB;
