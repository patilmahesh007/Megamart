import dotenv from "dotenv";
dotenv.config();

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is required");
}

import "./models/category.model.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import helmet from "helmet";

import userrouter from "./routes/auth.routes.js";
import productrouter from "./routes/product.routes.js";

const app = express();

app.use(helmet());
app.set("trust proxy", 1); 
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.CLIENT_URL.split(",") 
    : "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10kb" }));

app.use(
  cookieSession({
    name: "widget_session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined,
    httpOnly: true,
    path: "/",
  })
);

app.use((req, res, next) => {
  if (!req.session) {
    console.error("Session initialization failed");
    return res.status(500).json({ error: "Session initialization failed" });
  }
  next();
});

app.get("/setcookie", (req, res) => {
  req.session.value = "abc123";
  res.cookie("test_cookie", "working", {
    sameSite: "none",
    secure: true,
    httpOnly: true
  });
  res.send("Cookies set successfully");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    session: !!req.session,
    environment: process.env.NODE_ENV
  });
});

app.use("/api", userrouter);
app.use("/product", productrouter);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`);
  });
};

startServer();