const { Schema } = require("mongoose");

const bookingSchema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    carNumber: {
      type: String,
      required: [true, "Car number is required"],
      trim: true,
      uppercase: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    actualReturnDate: {
      type: Date,
      default: null,
    },
    penaltyAmount: {
      type: Number,
      default: 0,
      min: [0, "Penalty amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = bookingSchema;
