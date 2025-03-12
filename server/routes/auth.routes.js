import express from "express";
import { sendOtp, verifyOtp,getOtp,verifyRole } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/send", sendOtp);
router.get("/current-otp", getOtp);
router.get("/verify-role", verifyRole);
router.post("/verify", verifyOtp);

export default router;
