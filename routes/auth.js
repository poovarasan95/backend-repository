import express from "express"
import {signup,login,leaveform} from "../controllers/auth.controller.js";
import{studentinfo,leaveHistory,leaveCancel,studentinfoUpdate} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/leaveform",leaveform)

router.get("/studentinfo",studentinfo)

router.get("/leaveHistory",leaveHistory)

router.delete("/leaveCancel",leaveCancel)

router.put("/studentinfoUpdate",studentinfoUpdate)

export default router;