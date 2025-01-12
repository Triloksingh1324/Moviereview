import mongoose from "mongoose";
import { dbName } from "../constant.js";
import dotenv from "dotenv"

dotenv.config()
// console.log(process.env.MONGODB_URL,dbName)
const dbConnect=async()=>{
    try {
        // db.users.dropIndex("userName_1")
        const connectInstance=await mongoose.connect(
            `${process.env.MONGODB_URL}/${dbName}`
        )
        console.log("Mongodb connected",connectInstance.connection.host)
    } catch (error) {
        console.log("Mongodb Connection Error",error)
    }
}
export default dbConnect