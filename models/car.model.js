const mongoose = require("mongoose");
const carSchema = require("./schemas/carSchema");

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
