import express from "express";
import { createPaymentOrder, verifyPayment } from "../controller/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create", createPaymentOrder);
paymentRouter.post("/verify-payment", verifyPayment);

export default paymentRouter;
