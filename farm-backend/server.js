require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Security
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
const llmRoutes = require("./routes/llm");
const authRoutes = require("./routes/auth");
const farmLogsRoutes = require("./routes/farmLogs");
const eventsRoutes = require("./routes/events");
const countRoutes = require("./routes/count");
const pricesRoutes = require("./routes/prices");
const settingsRoutes = require("./routes/settings");
const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment");
const ordersRoutes = require("./routes/orders");
const transactionsRoutes = require("./routes/transactions");
const supportRoutes = require("./routes/support");
const weatherRoute = require("./routes/weather");
const aiSummaryRoute = require("./routes/aiSummary");
const sanitizeTestRoute = require("./routes/sanitizeTest");
const lstmRoutes = require("./routes/lstm");
const forecastRoute = require("./routes/forecast");

const app = express();
const port = process.env.PORT || 4000;

// ------------------------------------------------------
// CORS
// ------------------------------------------------------
app.use(cors());

// ------------------------------------------------------
// FIX ✔ Prevent GET from being parsed as JSON
// ------------------------------------------------------
app.use((req, res, next) => {
  if (req.method === "GET") return next();
  return express.json()(req, res, next);
});

// ------------------------------------------------------
// Security Middlewares
// ------------------------------------------------------
app.use(helmet());

// Prevent NoSQL injection
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (let key in req.body) {
      if (key.startsWith("$")) delete req.body[key];
      if (typeof req.body[key] === "object") {
        for (let k in req.body[key]) {
          if (k.startsWith("$")) delete req.body[key][k];
        }
      }
    }
  }
  next();
});

// Login brute-force limiter
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many failed login attempts. Please try again later.",
    });
  },
});

// Global rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, try again later.",
});
app.use("/api/", apiLimiter);

// ------------------------------------------------------
// Serve static files
// ------------------------------------------------------
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

// ------------------------------------------------------
// MongoDB Connection
// ------------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ------------------------------------------------------
// Base route
// ------------------------------------------------------
app.get("/", (req, res) => res.send("🌱 AgriTrust Backend Running"));

// ------------------------------------------------------
// Apply Login Rate Limit
// ------------------------------------------------------
app.use("/api/auth/login", loginLimiter);

// ------------------------------------------------------
// API ROUTES
// ------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/count", countRoutes);
app.use("/api/farm-logs", farmLogsRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/prices", pricesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/weather", weatherRoute);
app.use("/api/ai-summary", aiSummaryRoute);
app.use("/api/sanitizeTest", sanitizeTestRoute);
app.use("/api/lstm", lstmRoutes);

// LSTM Forecast Route (Your ML Prediction API)
app.use("/api/lstm/forecast", forecastRoute);

// ------------------------------------------------------
// ERROR HANDLER (Always Last)
// ------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ------------------------------------------------------
// Start Server
// ------------------------------------------------------
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

// Start background workers
require("./priceWatcher");
