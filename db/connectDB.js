import mongoose from "mongoose";
//import dotenv from "dotenv"

//dotenv.config();
const connectDB = async()=>{
    try{
      await mongoose.connect(process.env.MONGO_URL)
      console.log("mongodb connected")
    }catch(error){
      console.log(`Error in connecting Db:${error}`)
      process.exit(1)
    }
}
export default connectDB;