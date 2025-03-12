import User from "./../models/auth.model.js";
import getotp from "../config/generateOTP.js";
import createMessage from "../config/twilio.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

    // Generate JWT token with _id and name stored in the payload
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie with the generated token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use secure flag in production
      sameSite: "None",
    });
    
    if (req.session) {
      req.session.token = token;
    }

    user.isVerified = true;
    await user.clearOtp();

    return res.json({ message: "OTP verified successfully. User logged in.", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "OTP verification failed." });
  }
};
export const verifyRole = async (req, res) => {
  try {
    console.log(req);
    let token = req.headers.authorization?.split(" ")[1] || req.body.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({ role: user.role });
  } catch (error) {
    console.error("Error verifying role:", error);
    return res.status(500).json({ error: "Failed to verify role." });
  }
};
