import Product from "../models/product.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, currentPrice, originalPrice, category, mainImage, images, stock } = req.body;
    if (!name || !description || currentPrice == null || originalPrice == null || !category || !mainImage || !images || stock == null) {
      return errorResponse(res, "All fields are required", 400);
    }
    if (isNaN(currentPrice) || isNaN(originalPrice) || isNaN(stock)) {
      return errorResponse(res, "Current price, original price, and stock must be numbers", 400);
    }
    const product = new Product({
      name,
      description,
      currentPrice,
      originalPrice,
      category,
      mainImage,
      images,
      stock,
    });
    await product.save();
    return successResponse(res, "Product added successfully", product, 201);
  } catch (error) {
    console.error("Error adding product:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    return successResponse(res, "Product fetched successfully", product, 200);
  } catch (error) {
    console.error("Error fetching product:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    return successResponse(res, "Product updated successfully", product, 200);
  } catch (error) {
    console.error("Error updating product:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }
    return successResponse(res, "Product deleted successfully", product, 200);
  } catch (error) {
    console.error("Error deleting product:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    return successResponse(res, "Products fetched successfully", products, 200);
  } catch (error) {
    console.error("Error listing products:", error);
    return errorResponse(res, error.message, 500);
  }
};
