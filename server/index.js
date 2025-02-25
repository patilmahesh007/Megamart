import dotenv from "dotenv";
dotenv.config();

import "./models/category.model.js"; 


import mongoose from "mongoose";
import express from "express";
import cors from "cors";


import userrouter from "./routes/auth.routes.js";
import productrouter from "./routes/product.routes.js";
import orderRouter from "./order.routes.js";
import cartRouter from "./cart.routes.js";



const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "server is running",
  });
});

app.use("/api", userrouter);
app.use("/product", productrouter);
router.use("/order", orderRouter);
router.use("/cart", cartRouter);





const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
