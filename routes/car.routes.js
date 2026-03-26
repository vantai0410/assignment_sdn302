const express = require("express");
const router = express.Router();
const carCtrl = require("../controllers/car.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const {
  validateCreateCar,
  validateUpdateCar,
  validateDeleteCar,
} = require("../middlewares/car.middleware");

// GET - public (tất cả xem được)
router.get("/", carCtrl.getAll);

// POST - admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  validateCreateCar,
  carCtrl.create,
);

// PUT/DELETE - admin only
router
  .route("/:id")
  .put(protect, authorize("admin"), validateUpdateCar, carCtrl.update)
  .delete(protect, authorize("admin"), validateDeleteCar, carCtrl.delete);

module.exports = router;
