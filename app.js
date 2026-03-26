require("dotenv").config();
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

const bookingRoutes = require("./routes/booking.routes");
const carRoutes = require("./routes/car.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session middleware (phải trước passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.config");

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Kết nối DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("→ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cars", carRoutes);

// Web Routes - serve views
app.get("/", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/auth-success", (req, res) => res.render("auth-success"));
app.get("/cars", (req, res) => res.render("cars"));
app.get("/bookings", (req, res) => res.render("bookings"));

const PORT = process.env.PORT || 5000;

// Start server
if (process.env.NODE_ENV === "production") {
  // Production: Check if SSL files exist (for local HTTPS testing)
  const keyPath = process.env.SSL_KEY_PATH || "./server.key";
  const certPath = process.env.SSL_CERT_PATH || "./server.cert";

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    // Local production with SSL
    try {
      const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      const server = https.createServer(options, app);
      server.listen(PORT, () => {
        console.log(`✓ HTTPS Server → https://localhost:${PORT}`);
      });
    } catch (err) {
      console.error("❌ SSL Certificate Error:", err.message);
      process.exit(1);
    }
  } else {
    // Production on Render/Railway/etc (HTTPS handled by platform)
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(
        `✓ HTTP Server (Platform handles HTTPS) → http://localhost:${PORT}`,
      );
    });
  }
} else {
  // Development: HTTP
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`✓ HTTP Server → http://localhost:${PORT}`);
  });
}

module.exports = app;
