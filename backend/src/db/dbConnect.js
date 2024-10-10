import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB()
{
    try
    {
        const mongoDbInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        // console.log("Database connected with host:",mongoDbInstance.connection.host);
    }
    catch(error)
    {
        console.error("There is an Error in database connection",+error.message);
        // process.exit(1);
    }
}