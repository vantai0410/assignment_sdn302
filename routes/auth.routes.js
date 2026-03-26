const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  register,
  login,
  googleCallback,
  logout,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/auth.validation.middleware");

// Traditional login routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  googleCallback,
);

// Private routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
