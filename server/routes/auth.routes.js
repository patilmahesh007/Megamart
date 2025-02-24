import express from "express";
import { sendOtp, verifyOtp,getOtp } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/send", sendOtp);
router.get("/current-otp", getOtp);
router.post("/verify", verifyOtp);

export default router;
