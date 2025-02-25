import Order from "../models/order.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const createOrder = async (req, res) => {
  try {
    const { user, orderItems, totalPrice, shippingAddress } = req.body;
    if (!user || !orderItems || !totalPrice || !shippingAddress) {
      return errorResponse(res, "All order fields are required", 400);
    }
    const order = new Order({ user, orderItems, totalPrice, shippingAddress });
    await order.save();
    return successResponse(res, "Order created successfully", order, 201);
  } catch (error) {
    console.error("Error creating order:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user")
      .populate("orderItems.product");
    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }
    return successResponse(res, "Order fetched successfully", order, 200);
  } catch (error) {
    console.error("Error fetching order:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return errorResponse(res, "Status is required", 400);
    }
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }
    return successResponse(res, "Order status updated successfully", order, 200);
  } catch (error) {
    console.error("Error updating order status:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const listOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { user: userId } : {};
    const orders = await Order.find(filter)
      .populate("user")
      .populate("orderItems.product");
    return successResponse(res, "Orders fetched successfully", orders, 200);
  } catch (error) {
    console.error("Error listing orders:", error);
    return errorResponse(res, error.message, 500);
  }
};
