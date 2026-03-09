const express = require("express");
const router = express.Router();
const carCtrl = require("../controllers/car.controller");

router.route("/").get(carCtrl.getAll).post(carCtrl.create);

router.route("/:id").put(carCtrl.update).delete(carCtrl.delete);

module.exports = router;
