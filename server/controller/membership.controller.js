import MembershipPlan from "../models/membershipPlan.model.js";
import { successResponse, errorResponse } from "../utils/responder.util.js";

export const listMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({});
    return successResponse(res, "Membership plans fetched successfully", plans, 200);
  } catch (error) {
    console.error("Error listing membership plans:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const purchaseMembership = async (req, res) => {
  try {
    const { userId, planId, paymentId } = req.body;
    if (!userId || !planId) {
      return errorResponse(res, "User and plan are required", 400);
    }
    return successResponse(res, "Membership purchased successfully", { userId, planId, paymentId }, 200);
  } catch (error) {
    console.error("Error purchasing membership:", error);
    return errorResponse(res, error.message, 500);
  }
};

export const getMembershipStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    return successResponse(res, "Membership status fetched successfully", { isActive: true, expiryDate: "2024-12-31" }, 200);
  } catch (error) {
    console.error("Error fetching membership status:", error);
    return errorResponse(res, error.message, 500);
  }
};
