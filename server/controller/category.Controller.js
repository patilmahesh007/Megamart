import Category from "../models/category.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const addCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    if (!name) {
      return errorResponse(res, "Category name is required", 400);
    }
    
    if (!req.files || !req.files.categoryImg || req.files.categoryImg.length === 0) {
      return errorResponse(res, "Category image is required", 400);
    }
    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return errorResponse(res, "Category already exists", 400);
    }
    
    const imageUrl = req.files.categoryImg[0].path;
    
    const category = await Category.create({ 
      name, 
      description,
      categoryImg: imageUrl,
      parent: parent || null  
    });
    
    return successResponse(res, "Category added successfully", category, 201);
  } catch (error) {
    console.error("Error adding category:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).populate("subCategories");
    return successResponse(res, "Categories retrieved successfully", categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }
    return successResponse(res, "Category deleted successfully", category);
  } catch (error) {
    console.error("Error deleting category:", error);
    return errorResponse(res, error.message, 500);
  }
};
