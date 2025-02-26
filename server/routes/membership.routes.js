import express from "express";
import {
  listMembershipPlans,
  purchaseMembership,
  getMembershipStatus,
} from "../controller/membership.controller.js";

const membershipRouter = express.Router();

membershipRouter.get("/plans", listMembershipPlans);
membershipRouter.post("/buy", purchaseMembership);
membershipRouter.get("/status/:userId", getMembershipStatus);

export default membershipRouter;
