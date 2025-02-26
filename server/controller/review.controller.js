import Review from "../models/review.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const addReview = async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;
    if (!user || !product || !rating) {
      return errorResponse(res, "User, product, and rating are required", 400);
    }
    const review = new Review({ user, product, rating, comment });
    await review.save();
    return successResponse(res, "Review added successfully", review, 201);
  } catch (error) {
    console.error("Error adding review:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const review = await Review.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }
    return successResponse(res, "Review updated successfully", review, 200);
  } catch (error) {
    console.error("Error updating review:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return errorResponse(res, "Review not found", 404);
    }
    return successResponse(res, "Review deleted successfully", review, 200);
  } catch (error) {
    console.error("Error deleting review:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const listReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate("user", "name profileImage");
    return successResponse(res, "Reviews fetched successfully", reviews, 200);
  } catch (error) {
    console.error("Error listing reviews:", error);
    return errorResponse(res, error.message, 500);
  }
};
