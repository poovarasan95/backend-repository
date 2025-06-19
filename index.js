import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.js"
import connectDB from "./db/connectDB.js"
import cors from "cors"


const app = express()

app.use(cors());
dotenv.config();


const PORT= process.env.PORT;


app.use(express.json());

app.use("/api/auth",authRoute)



app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
    connectDB();
})