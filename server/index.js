import dotenv from "dotenv";
dotenv.config();

// Validate environment variables before anything else
if (!process.env.SESSION_SECRET) throw new Error("Missing SESSION_SECRET");
if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI");
if (process.env.NODE_ENV === "production" && !process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL required in production");
}

// Force production environment if deployed
if (process.env.VERCEL || process.env.AWS_EXECUTION_ENV) {
  process.env.NODE_ENV = "production";
}

import "./models/category.model.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import helmet from "helmet";

// Routers
import userrouter from "./routes/auth.routes.js";
import productrouter from "./routes/product.routes.js";

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    }
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true
  }
}));

// Critical proxy configuration
app.set("trust proxy", process.env.NODE_ENV === "production" ? 2 : 0);

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? process.env.CLIENT_URL.split(",")
    : "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  maxAge: 86400
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Session Configuration
app.use(
  cookieSession({
    name: "widget_session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    domain: process.env.NODE_ENV === "production" 
      ? ".your-actual-domain.com" // Change to your real domain
      : undefined,
    httpOnly: true,
    path: "/",
    overwrite: true,
    signed: true
  })
);

// Session Validation Middleware
app.use((req, res, next) => {
  if (!req.session) {
    console.error("Session initialization failed - Headers:", req.headers);
    return res.status(500).json({
      error: "Session initialization failed",
      cookiesReceived: req.headers.cookie || "none",
      secureConnection: req.secure
    });
  }
  next();
});

// Enhanced Test Endpoint
app.get("/setcookie", (req, res) => {
  req.session.value = `test-${Date.now()}`;
  res.cookie("explicit_cookie", "works", {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    domain: process.env.NODE_ENV === "production" 
      ? ".your-actual-domain.com" 
      : undefined,
    path: "/"
  });
  
  res.json({
    message: "Cookies set",
    sessionId: req.session.id,
    headers: {
      protocol: req.protocol,
      secure: req.secure,
      host: req.get("host")
    }
  });
});

// Diagnostic Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    sessionInitialized: !!req.session,
    environment: process.env.NODE_ENV,
    secureConnection: req.secure,
    protocol: req.protocol,
    hostHeader: req.get("host"),
    clientIp: req.ip
  });
});

// Routes
app.use("/api", userrouter);
app.use("/product", productrouter);

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      autoIndex: process.env.NODE_ENV !== "production"
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Server Initialization
const startServer = async () => {
  await connectDB();
  
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`);
  });

  // Production-specific optimizations
  if (process.env.NODE_ENV === "production") {
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
  }
};

startServer();