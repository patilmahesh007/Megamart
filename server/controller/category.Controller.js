import Category from "../models/category.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return errorResponse(res, "Category name is required", 400);
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return errorResponse(res, "Category already exists", 400);
    }

    const category = await Category.create({ name, description });
    return successResponse(res, "Category added successfully", category, 201);
  } catch (error) {
    console.error("Error adding category:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return successResponse(res, "Categories retrieved successfully", categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return errorResponse(res, error.message, 500);
  }
};
