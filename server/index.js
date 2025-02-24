import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userrouter from "./routes/auth.routes.js";

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

// Connect to the database before starting the server.
connectDB();

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
