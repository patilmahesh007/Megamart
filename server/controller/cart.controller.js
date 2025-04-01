import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";
import getRequestingUser from "../utils/getid.util.js";

export const calculateTotalPrice = async (cart) => {
  let total = 0;
  const productIds = cart.items.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = {};
  products.forEach(product => {
    productMap[product._id.toString()] = product;
  });
  for (let item of cart.items) {
    const prod = productMap[item.product.toString()];
    if (prod && prod.currentPrice) {
      total += Number(prod.currentPrice) * Number(item.quantity);
    }
  }
  return total;
};
export const getCartTotal = async (req, res) => {
  try {
    const requestingUser = await getRequestingUser(req);
    const cart = await Cart.findOne({ user: requestingUser._id });
    if (!cart) {
      return errorResponse(res, "Cart not found", 404);
    }
    const total = await calculateTotalPrice(cart);
    return successResponse(res, "Cart total calculated successfully", { total });
  } catch (error) {
    console.error("Error calculating total price:", error);
    return errorResponse(res, error.message, 500);
  }
};
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
    cart.totalPrice = await calculateTotalPrice(cart);
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
    cart.totalPrice = await calculateTotalPrice(cart);
    await cart.save();
    return successResponse(res, "Item removed from cart", cart, 200);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const updateCart = async (req, res) => {
  try {
    const requestingUser = await getRequestingUser(req);
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return errorResponse(res, "Product and quantity are required", 400);
    }
    let cart = await Cart.findOne({ user: requestingUser._id });
    if (!cart) {
      return errorResponse(res, "Cart not found", 404);
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return errorResponse(res, "Product not found in cart", 404);
    }
    cart.items[itemIndex].quantity = quantity;
    cart.totalPrice = await calculateTotalPrice(cart);
    await cart.save();
    return successResponse(res, "Cart updated successfully", cart, 200);
  } catch (error) {
    console.error("Error updating cart:", error);
    return errorResponse(res, error.message, 500);
  }
};
