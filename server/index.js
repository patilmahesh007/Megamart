import dotenv from "dotenv";
dotenv.config();

// Validate critical environment variables
if (!process.env.SESSION_SECRET) throw new Error("Missing SESSION_SECRET");
if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI");
if (process.env.NODE_ENV === "production" && !process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL required in production");
}

// Force production environment if deployed on Vercel or AWS Lambda
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
// ... import other routers as needed

const app = express();

// --- Security Middleware --- //
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-cdn.com"],
      },
    },
    hsts:
      process.env.NODE_ENV === "production"
        ? {
            maxAge: 63072000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
  })
);

// Set trust proxy for secure cookies when behind a proxy
app.set("trust proxy", process.env.NODE_ENV === "production" ? 2 : 0);

// --- CORS Configuration --- //
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL.split(",")
      : "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  maxAge: 86400,
};
app.use(cors(corsOptions));
// Ensure preflight requests are handled
app.options("*", cors());

// --- Body Parsing --- //
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.text({ type: "text/plain" }));

// --- Session Configuration --- //
app.use(
  cookieSession({
    name: "widget_session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production", // true if using HTTPS
    // In production, use just the domain name (without protocol or port)
    domain:
      process.env.NODE_ENV === "production" ? "yourdomain.com" : undefined,
    httpOnly: true,
    path: "/",
    overwrite: true,
    signed: true,
    proxy: true,
  })
);

// --- Session Validation Middleware --- //
app.use((req, res, next) => {
  if (!req.session) {
    console.error("Session initialization failed", {
      host: req.headers.host,
      origin: req.headers.origin,
      cookie: req.headers.cookie,
    });
    return res.status(500).json({ error: "Session initialization failed" });
  }
  // Add security headers for session cookies
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("X-Content-Type-Options", "nosniff");
  next();
});

// --- Test Endpoints --- //
app.get("/cookie-test", (req, res) => {
  // Increment visit counter in session
  req.session.visits = (req.session.visits || 0) + 1;

  // Also set an explicit cookie (for demonstration)
  res.cookie("explicit_cookie", `test-${Date.now()}`, {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    domain: process.env.NODE_ENV === "production" ? "yourdomain.com" : undefined,
    path: "/",
    maxAge: 3600000, // 1 hour
  });

  res.json({
    success: true,
    session: req.session,
    cookies: req.headers.cookie,
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    sessionInitialized: !!req.session,
    environment: process.env.NODE_ENV,
    secure: req.secure,
    protocol: req.protocol,
    host: req.get("host"),
    clientIp: req.ip,
  });
});

// --- API Routes --- //
app.use("/api", userrouter);
app.use("/product", productrouter);
// ... mount other routers as needed

// --- Database Connection --- //
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      autoIndex: process.env.NODE_ENV !== "production",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// --- Server Initialization --- //
const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`
    );
  });

  if (process.env.NODE_ENV === "production") {
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
    server.on("clientError", (err, socket) => {
      console.error("Client connection error:", err);
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
  }
};

startServer();
