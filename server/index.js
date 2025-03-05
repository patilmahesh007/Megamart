import dotenv from "dotenv";
dotenv.config();

import "./models/category.model.js"; 
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";

import userrouter from "./routes/auth.routes.js";
import productrouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import cartRouter from "./routes/cart.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import membershipRouter from "./routes/membership.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import categoryRouter from "./routes/category.routes.js"; 

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.options("*", cors()); 


app.use(cookieSession({
  name: 'widget_session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000, 
  sameSite: "none",        
  secure: process.env.NODE_ENV === "production",
}));

app.get("/setcookie", (req, res) => {
  req.session.value = "abc123";
  res.send("Cookie set with value abc123");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "server is running",
  });
});

app.use("/api", userrouter);
app.use("/product", productrouter);
app.use("/order", orderRouter);
app.use("/cart", cartRouter);
app.use("/payment", paymentRouter);
app.use("/review", reviewRouter);
app.use("/membership", membershipRouter);
app.use("/upload", uploadRouter);
app.use("/category", categoryRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

connectDB();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
