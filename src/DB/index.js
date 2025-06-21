import mongoose from "mongoose"
import { DB_Name } from "../utils/constant.js"

const connectDB = async ()=>{
   try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)
     console.log("mongodb connected")
   } catch (error) {
    console.log("error occured while connecting to mongodb",error)
    process.exit(1)
   }
}

export default connectDB