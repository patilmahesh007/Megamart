import User from "./../models/auth.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";
import jwt from "jsonwebtoken";


export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return successResponse(res, "Users fetched successfully", { users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse(res, "Failed to fetch users", 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findById(id);
    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, "User fetched successfully", { user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse(res, "Failed to fetch user", 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) return errorResponse(res, "User not found", 404);
    return successResponse(res, "User updated successfully", { user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse(res, "Failed to update user", 500);
  }
};


export const disableUser = async (req, res) => {
    try {
      const { id } = req.params;
      const targetUser = await User.findById(id);
      if (!targetUser) return errorResponse(res, "User not found", 404);
  
      const token = req.headers.authorization?.split(" ")[1] || req.body.token;
      if (!token) return errorResponse(res, "Unauthorized", 401);
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const requestingUser = await User.findById(decoded._id);
      if (!requestingUser) return errorResponse(res, "Unauthorized", 401);
  
      if (targetUser.role === 'superadmin' && requestingUser.role !== 'superadmin') {
        return errorResponse(res, "Superadmin account cannot be disabled by non-superadmin", 403);
      }
  
      if (requestingUser.role === 'admin' && targetUser.role !== 'customer') {
        return errorResponse(res, "Admins can only disable customer accounts", 403);
      }
  
      if (requestingUser.role === 'customer') {
        return errorResponse(res, "You are not authorized to disable accounts", 403);
      }
  
      targetUser.disabled = true;
      await targetUser.save();
      return successResponse(res, "User disabled successfully", { user: targetUser });
    } catch (error) {
      console.error("Error disabling user:", error);
      return errorResponse(res, "Failed to disable user", 500);
    }
  };
  
  export const enableUser = async (req, res) => {
    try {
      const { id } = req.params;
      const targetUser = await User.findById(id);
      if (!targetUser) return errorResponse(res, "User not found", 404);
  
      const token = req.headers.authorization?.split(" ")[1] || req.body.token;
      if (!token) return errorResponse(res, "Unauthorized", 401);
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const requestingUser = await User.findById(decoded._id);
      if (!requestingUser) return errorResponse(res, "Unauthorized", 401);
  
      if (targetUser.role === 'superadmin' && requestingUser.role !== 'superadmin') {
        return errorResponse(res, "Superadmin account cannot be enabled by non-superadmin", 403);
      }
  
      if (requestingUser.role === 'admin' && targetUser.role !== 'customer') {
        return errorResponse(res, "Admins can only enable customer accounts", 403);
      }
  
      if (requestingUser.role === 'customer') {
        return errorResponse(res, "You are not authorized to enable accounts", 403);
      }
  
      targetUser.disabled = false;
      await targetUser.save();
      return successResponse(res, "User enabled successfully", { user: targetUser });
    } catch (error) {
      console.error("Error enabling user:", error);
      return errorResponse(res, "Failed to enable user", 500);
    }
  };
