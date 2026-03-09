const mongoose = require("mongoose");
const bookingSchema = require("./schemas/bookingSchema");

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
