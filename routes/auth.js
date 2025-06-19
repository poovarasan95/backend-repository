import express from "express"
import {signupUser,loginUser,leaveformUser} from "../controllers/auth.controller.js";
import{studentinfoUser,leaveHistoryUser,leaveCancelUser,studentinfoUpdateUser} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signup",signupUser)

router.post("/login",loginUser)

router.post("/leaveform",leaveformUser)

router.get("/studentinfo",studentinfoUser)

router.get("/leaveHistory",leaveHistoryUser)

router.delete("/leaveCancel",leaveCancelUser)

router.put("/studentinfoUpdate",studentinfoUpdateUser)

export default router;