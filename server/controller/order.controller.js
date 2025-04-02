import Order from "../models/order.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";
import getRequestingUser from "../utils/getid.util.js";

export const createOrder = async (req, res) => {
  try {
    const requestingUser = await getRequestingUser(req);
    const { orderItems, totalPrice, shippingAddress, paymentMode } = req.body;

    if (!orderItems || !totalPrice || !shippingAddress) {
      return errorResponse(res, "All order fields (orderItems, totalPrice, shippingAddress, paymentMode) are required", 400);
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return errorResponse(res, "Order must contain at least one item", 400);
    }

    const formattedOrderItems = orderItems.map((item, index) => {
      if (!item.productId) {
        return errorResponse(res, `Missing 'product' field in orderItems[${index}]`, 400);
      }
      if (!item.quantity || item.quantity <= 0) {
        return errorResponse(res, `Invalid or missing 'quantity' field in orderItems[${index}]`, 400);
      }
      if (!item.totalPrice || item.totalPrice <= 0) {
        return errorResponse(res, `Invalid or missing 'price' field in orderItems[${index}]`, 400);
      }

      return {
        product: item.productId,
        quantity: item.quantity,
        price: item.totalPrice, 
      };
    });

    const order = new Order({
      user: requestingUser._id,
      orderItems: formattedOrderItems,
      totalPrice,
      shippingAddress,
      paymentMode, 
      paymentStatus: "pending",
    });

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

    const validStatuses = ["pending", "shipped", "delivered", "cancelled by user", "cancelled by admin"];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, "Invalid status", 400);
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

export const getUserOrders = async (req, res) => {
  try {
    const user = await getRequestingUser(req);
    if (!user) {
      return errorResponse(res, "Unauthorized request", 401);
    }
    const orders = await Order.find({ user: user._id })
      .populate("user")
      .populate("orderItems.product");
    return successResponse(res, "User orders fetched successfully", { orders }, 200);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return errorResponse(res, error.message, 500);
  }
};
export const updateOrderStatusByUserId = async (req, res) => {
  try {
    const user = await getRequestingUser(req);
    if (!user) {
      return errorResponse(res, "Unauthorized request", 401);
    }
    
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return errorResponse(res, "Order ID and status are required", 400);
    }

    const validStatuses = ["pending", "shipped", "delivered", "cancelled by user", "cancelled by admin"];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, "Invalid status", 400);
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: user._id },
      { status },
      { new: true }
    );

    if (!order) {
      return errorResponse(res, "Order not found or unauthorized to update", 404);
    }

    return successResponse(res, "Order status updated successfully", order, 200);
  } catch (error) {
    console.error("Error updating order status:", error);
    return errorResponse(res, error.message, 500);
  }
};
