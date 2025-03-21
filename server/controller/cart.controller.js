import Cart from "../models/cart.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";
import getRequestingUser from "../utils/getid.util.js";

export const getCart = async (req, res) => {
  try {
    const requestingUser = await getRequestingUser(req);
    const cart = await Cart.findOne({ user: requestingUser._id }).populate("items.product");
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
    const requestingUser = await getRequestingUser(req);
    const { product, quantity } = req.body;
    if (!product || !quantity) {
      return errorResponse(res, "Product and quantity are required", 400);
    }
    let cart = await Cart.findOne({ user: requestingUser._id });
    if (!cart) {
      cart = new Cart({ user: requestingUser._id, items: [{ product, quantity }] });
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
    const requestingUser = await getRequestingUser(req);
    const { product } = req.body;
    if (!product) {
      return errorResponse(res, "Product is required", 400);
    }
    let cart = await Cart.findOne({ user: requestingUser._id });
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
