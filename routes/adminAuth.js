import express from "express"
import {adminLoginUser,getAllLeaves,updateLeaveStatus} from "../controllers/adminAuthController.js"


const router = express.Router();

router.post("/adminLogin",adminLoginUser)

router.get('/leaves', getAllLeaves); 

router.put('/leaves/:id', updateLeaveStatus); 


export default router;