import Payment from "../models/payment.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import getRequestingUser from "../utils/getid.util.js";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    if (!amount) {
      return errorResponse(res, "Amount is required", 400);
    }

    const options = {
      amount: amount * 100, 
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    if (!order) {
      return errorResponse(res, "Failed to create payment order", 500);
    }

    return successResponse(res, "Payment order created successfully", order, 201);
  } catch (error) {
    console.error("Error creating payment order:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, amount } = req.body;
    if (!orderId || !paymentId || !signature || !amount) {
      return errorResponse(res, "Missing required payment details", 400);
    }

    const user = await getRequestingUser(req);
    if (!user) {
      return errorResponse(res, "Unauthorized request", 401);
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return errorResponse(res, "Invalid Razorpay signature", 400);
    }

    const payment = new Payment({
      user: user._id,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      amount,
      status: "completed",
    });

    await payment.save();

    return successResponse(res, "Payment verified and stored successfully", { payment }, 200);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};
