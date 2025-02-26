import express from "express";
import {
  addReview,
  updateReview,
  deleteReview,
  listReviews,
} from "../controller/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", addReview);
reviewRouter.put("/update/:id", updateReview);
reviewRouter.delete("/delete/:id", deleteReview);
reviewRouter.get("/list/:productId", listReviews);

export default reviewRouter;
