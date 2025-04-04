import User from "./../models/auth.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";
import jwt from "jsonwebtoken";
import getRequestingUser from "../utils/getid.util.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return successResponse(res, "Users fetched successfully", { users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse(res, "Failed to fetch users", 500);
  }
};

/**
 * Get a single user by id (admin functionality)
 */
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


export const disableUser = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = await User.findById(id);
    if (!targetUser) return errorResponse(res, "User not found", 404);

    const requestingUser = await getRequestingUser(req);
    
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

    const requestingUser = await getRequestingUser(req);

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

export const addUserAddress = async (req, res) => {
  try {
    const requestingUser = await getRequestingUser(req);
    const id = requestingUser._id;
    const { address } = req.body; 
    const user = await User.findById(id);
    if (!user) return errorResponse(res, "User not found", 404);

    user.addresses.push(address);
    await user.save();

    return successResponse(res, "Address added successfully", { addresses: user.addresses });
  } catch (error) {
    console.error("Error adding user address:", error);
    return errorResponse(res, "Failed to add user address", 500);
  }
};
export const updateUser = async (req, res) => {
  try {
    const requestingUser = await getRequestingUser(req);
    const id = requestingUser._id;
    const { name, phone } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    if (req.file) {
      updates.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) return errorResponse(res, "User not found", 404);

    return successResponse(res, "User updated successfully", {
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        profileImage: updatedUser.profileImage || "",
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        disabled: updatedUser.disabled,
        addresses: updatedUser.addresses || []
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse(res, "Failed to update user", 500);
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const requestingUser = await getRequestingUser(req);
    const id = requestingUser._id;
    const { index, address } = req.body; 

    const user = await User.findById(id);
    if (!user) return errorResponse(res, "User not found", 404);

    if (typeof index !== 'number' || index < 0 || index >= user.addresses.length) {
      return errorResponse(res, "Invalid address index", 400);
    }

    user.addresses[index] = address;
    await user.save();

    return successResponse(res, "Address updated successfully", { addresses: user.addresses });
  } catch (error) {
    console.error("Error updating user address:", error);
    return errorResponse(res, "Failed to update user address", 500);
  }
};
export const getUserAddress = async (req, res) => {
  try {
    const requestingUser = await getRequestingUser(req);
    return successResponse(res, "User addresses fetched successfully", { addresses: requestingUser.addresses });
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return errorResponse(res, "Failed to fetch user addresses", 500);
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const user = await getRequestingUser(req);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, "User profile fetched successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        role: user.role,
        addresses: user.addresses,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return errorResponse(res, "Failed to fetch user profile", 500);
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const user = await getRequestingUser(req);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    return successResponse(res, "User profile updated successfully", {
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage || "",
        role: user.role,
        isVerified: user.isVerified,
        disabled: user.disabled,
        addresses: user.addresses || []
      }
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    return errorResponse(res, "Failed to update user profile", 500);
  }
};

