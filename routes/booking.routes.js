const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/booking.controller");

router.route("/").get(bookingCtrl.getAll).post(bookingCtrl.create);

router.route("/:id").put(bookingCtrl.update).delete(bookingCtrl.delete);

module.exports = router;
