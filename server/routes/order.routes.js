import express from "express";
import {
  createOrder,
  getOrder,
  updateOrderStatus,
  listOrders,
} from "../controller/order.controller.js";

const orderRouter = express.Router();
import { getOrderStats } from '../controller/loginStats.controller.js';

orderRouter.post("/create", createOrder);
orderRouter.get("/get/:id", getOrder);
orderRouter.put("/update-status/:id", updateOrderStatus);
orderRouter.get("/list", listOrders);


orderRouter.get("/stats", getOrderStats);
export default orderRouter;
