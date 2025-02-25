import Cart from "../models/cart.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return errorResponse(res, "Cart not found", 404);
    }
    return successResponse(res, "Cart fetched successfully", cart, 200);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId, product, quantity } = req.body;
    if (!userId || !product || !quantity) {
      return errorResponse(res, "User, product, and quantity are required", 400);
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === product);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity });
      }
    }
    await cart.save();
    return successResponse(res, "Cart updated successfully", cart, 200);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, product } = req.body;
    if (!userId || !product) {
      return errorResponse(res, "User and product are required", 400);
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, "Cart not found", 404);
    }
    cart.items = cart.items.filter(item => item.product.toString() !== product);
    await cart.save();
    return successResponse(res, "Item removed from cart", cart, 200);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return errorResponse(res, error.message, 500);
  }
};
