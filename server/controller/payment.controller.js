import Payment from "../models/payment.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
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
    return errorResponse(res, error.message, 500);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, amount, userId } = req.body;
    if (!orderId || !paymentId || !signature || !amount || !userId) {
      return errorResponse(res, "Missing required payment details", 400);
    }
    const payment = new Payment({
      order: orderId,
      user: userId,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      amount,
      status: "completed",
    });
    await payment.save();
    return successResponse(res, "Payment verified and saved successfully", payment, 200);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return errorResponse(res, error.message, 500);
  }
};
