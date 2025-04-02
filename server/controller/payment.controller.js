import Payment from "../models/payment.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
import getRequestingUser from "../utils/getid.util.js";
import Order from "../models/order.model.js";

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
    const { orderId, razorpayOrderId, paymentId, signature, amount } = req.body;

    if (!orderId || !razorpayOrderId || !paymentId || !signature || !amount) {
      return errorResponse(res, "Missing required payment details", 400);
    }

    const user = await getRequestingUser(req);
    if (!user) {
      return errorResponse(res, "Unauthorized request", 401);
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return errorResponse(res, "Invalid Razorpay signature", 400);
    }

    const order = await Order.findById(orderId); 
    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }
    order.status = "Order Confirmed";
    order.paymentStatus = "paid"; 
    order.razorpayPaymentId = paymentId; 
    
    await order.save();

    const payment = new Payment({
      user: user._id,
      order: order._id,
      razorpayOrderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      amount,
      status: "completed",
    });

    await payment.save();

    return successResponse(res, "Payment verified and order updated successfully", { payment }, 200);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};