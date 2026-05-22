import { config } from "dotenv";
import { connect } from 'mongoose';

// Load environment variables from .env file
config();

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Exits the process if the connection fails to prevent the server from running in a broken state.
 */
const connectDB = async () => {
    try {
        // Attempt to connect using the connection string from environment variables
        await connect(process.env.DB_URL);
        console.log("Database connected successfully");
    } catch (error) {
        // Log detailed error message for debugging
        console.log(error.message);
        console.log("Error in connecting DB");
        
        // Critical failure: kill the server process since DB is required for all operations
        console.error("FATAL: Cannot connect to database. Exiting.");
        process.exit(1);
    }
};

export default connectDB;
