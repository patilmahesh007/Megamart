import User from "./../models/auth.model.js";
import getotp from "../config/generateOTP.js";
import createMessage from "../config/twilio.js";
import bcrypt from "bcrypt";

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }
    const otp = getotp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashedOtp = await bcrypt.hash(otp, 10);
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, otp: hashedOtp, otpExpiresAt });
    } else {
      user.otp = hashedOtp;
      user.otpExpiresAt = otpExpiresAt;
    }
    await user.save();
    await createMessage(phone, otp);
    return res.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ error: "Failed to send OTP." });
  }
};

export const getOtp = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired. Please request a new one." });
    }
    return res.json({ otp: user.otp });
  } catch (error) {
    console.error("Error fetching OTP:", error);
    return res.status(500).json({ error: "Failed to fetch OTP." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone number and OTP are required." });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired. Please request a new one." });
    }
    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }
    
    user.isVerified = true;
    
    req.session.userId = user._id;
    
    await user.clearOtp();
    return res.json({ message: "OTP verified successfully. User logged in." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "OTP verification failed." });
  }
};
