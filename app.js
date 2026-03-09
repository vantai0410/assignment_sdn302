require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const bookingRoutes = require("./routes/booking.routes");
const carRoutes = require("./routes/car.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.get("/cars", (req, res) => res.render("cars"));
app.get("/bookings", (req, res) => res.render("bookings"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
