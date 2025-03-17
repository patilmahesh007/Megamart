import Product from "../models/product.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      currentPrice, 
      originalPrice, 
      category, 
      stock,
      brand,
      dietaryPreference,
      allergenInformation,
      servingSize,
      disclaimer,
      customerCareDetails,
      sellerName,
      sellerAddress,
      sellerLicenseNo,
      manufacturerName,
      manufacturerAddress,
      countryOfOrigin,
      shelfLife
    } = req.body;

    if (!name || !description || currentPrice == null || originalPrice == null || !category || stock == null) {
      return errorResponse(res, "All fields are required", 400);
    }
    if (isNaN(currentPrice) || isNaN(originalPrice) || isNaN(stock)) {
      return errorResponse(res, "Current price, original price, and stock must be numbers", 400);
    }

    let mainImageUrl = "";
    let imagesUrls = [];

    if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
      mainImageUrl = req.files.mainImage[0].path;
    } else {
      return errorResponse(res, "Main image is required", 400);
    }

    if (req.files && req.files.images && req.files.images.length > 0) {
      imagesUrls = req.files.images.map(file => file.path);
    }

    const product = new Product({
      name,
      description,
      currentPrice,
      originalPrice,
      category,
      stock,
      mainImage: mainImageUrl,
      images: imagesUrls,
      brand,
      dietaryPreference,
      allergenInformation,
      servingSize,
      disclaimer,
      customerCareDetails,
      sellerName,
      sellerAddress,
      sellerLicenseNo,
      manufacturerName,
      manufacturerAddress,
      countryOfOrigin,
      shelfLife,
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
    let updates = { ...req.body };

    if (updates.category === "") {
      delete updates.category;
    }

    if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
      updates.mainImage = req.files.mainImage[0].path;
    }
    if (req.files && req.files.images && req.files.images.length > 0) {
      updates.images = req.files.images.map(file => file.path);
    }

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

export const listProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ category: id }).populate("category");
    return successResponse(res, "Products fetched successfully", products, 200);
  } catch (error) {
    console.error("Error listing products by category:", error);
    return errorResponse(res, error.message, 500);
  }
};
