const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/booking.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const {
  validateCreateBooking,
  validateUpdateBooking,
  validateDeleteBooking,
} = require("../middlewares/booking.middleware");

// All authenticated users
router
  .route("/")
  .get(protect, bookingCtrl.getAll)
  .post(protect, validateCreateBooking, bookingCtrl.create);

// Admin only - update/delete
router
  .route("/:id")
  .put(protect, authorize("admin"), validateUpdateBooking, bookingCtrl.update)
  .delete(
    protect,
    authorize("admin"),
    validateDeleteBooking,
    bookingCtrl.delete,
  );

module.exports = router;
