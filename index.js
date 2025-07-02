import express from "express"
import dotenv from "dotenv"
import authRoute from "./routes/auth.js"
import adminAuthRoute from "./routes/adminAuth.js"
import connectDB from "./db/connectDB.js"
import cors from "cors"


const app = express()

app.use(cors());
dotenv.config();


const PORT= process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoute)
app.use("/api/admin",adminAuthRoute);



app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
    connectDB();
})