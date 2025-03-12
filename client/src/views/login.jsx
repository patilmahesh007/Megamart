import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { ArrowLeft, User } from "lucide-react";
import api from "../util/api.util.js";

const OTPVerification = () => {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const navigate = useNavigate();

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!mobileNumber) {
      toast.error("Please enter a mobile number");
      return;
    }
    try {
      const response = await api.post("/api/send", { phone: mobileNumber });
      toast.success(response.data.messages || "OTP sent successfully");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.messages || "Error sending OTP");
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight" && index < otp.length - 1) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "Backspace") {
      if (e.target.value === "" && index > 0) {
        const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== otp.length) {
      toast.error("Please enter complete OTP");
      return;
    }
    try {
      const getResponse = await api.get("/api/current-otp", {
        params: { phone: mobileNumber },
      });
      const currentHashedOtp = getResponse.data.otp;
      
      const isMatch = await bcrypt.compare(otpString, currentHashedOtp);
      if (!isMatch) {
        toast.error("Please enter correct OTP");
        return;
      }
    } catch (error) {
      toast.error("Error fetching current OTP");
      return;
    }
    
    try {
      const { data } = await api.post("/api/verify", {
        phone: mobileNumber,
        otp: otpString,
      });
      // Store the token in localStorage under the key "token"
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      toast.success(data.messages || "OTP verified successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.messages || "Error verifying OTP, please try again");
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.post("/api/send", {
        phone: mobileNumber,
      });
      toast.success(response.data.messages || "OTP resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.messages || "Error resending OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md">
        <Link to="/" className="mb-6 inline-block">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Link>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-pink-50 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center">
                <User className="" />
              </div>
              <h2 className="text-xl font-semibold">OTP Verification</h2>
              <p className="text-gray-500 text-sm">
                We will send you a One Time Password
              </p>
            </div>

            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-2">
                  Enter Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="+91-8005678943"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                GET OTP
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-pink-50 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center">
                <ArrowLeft className="hidden" />
              </div>
              <h2 className="text-xl font-semibold">OTP Verification</h2>
              <p className="text-gray-500 text-sm">
                Enter the OTP sent to {mobileNumber}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-xl font-semibold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors"
            >
              VERIFY & PROCEED
            </button>

            <p className="text-center text-sm">
              Didn't receive the OTP?{" "}
              <button onClick={handleResendOTP} className="text-purple-600 font-medium">
                RESEND OTP
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default OTPVerification;
