import User from "../models/auth.model.js";
import Product from "../models/product.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const uploadPhotoController = async (req, res) => {
console.log("Request Body:", req.body);

  try {
    const {userId,type,productId} = req.body;

    if (!req.file) {
      return errorResponse(res, "No file uploaded", 400);
    }
    const photoUrl = req.file.path;

    switch (type) {
      case "profile":
        if (!userId) {
          return errorResponse(res, "Unauthorized: No session token", 401);
        }
        await User.findByIdAndUpdate(userId, { profilePhoto: photoUrl });
        return successResponse(res, "Profile photo updated successfully", { profilePhoto: photoUrl });

      case "productMain":
        if (!productId) {
          return errorResponse(res, "Product ID is required", 400);
        }
        await Product.findByIdAndUpdate(productId, { mainImage: photoUrl });
        return successResponse(res, "Product main image updated successfully", { mainImage: photoUrl });

      case "productImages":
        if (!productId) {
          return errorResponse(res, "Product ID is required", 400);
        }
        await Product.findByIdAndUpdate(productId, {
          $push: { images: photoUrl },
        });
        return successResponse(res, "Product image added successfully", { image: photoUrl });

      default:
        return errorResponse(res, "Invalid upload type", 400);
    }
  } catch (error) {
    console.error("Error uploading photo:", error);
    return errorResponse(res, error.message, 500);
  }
};
