const Booking = require("../models/booking.model");
const Car = require("../models/car.model");
const { calculateRentalDays } = require("../utils/date.utils");

const bookingController = {
  // GET /api/bookings
  getAll: async (req, res) => {
    try {
      const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/bookings
  create: async (req, res) => {
    try {
      const { customerName, carNumber, startDate, endDate } = req.body;

      const car = await Car.findOne({ carNumber });
      if (!car) {
        return res
          .status(404)
          .json({ success: false, message: "Xe không tồn tại" });
      }

      if (car.status !== "available") {
        return res
          .status(400)
          .json({ success: false, message: "Xe hiện không khả dụng" });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        return res
          .status(400)
          .json({ success: false, message: "Ngày không hợp lệ" });
      }

      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: "Ngày kết thúc phải sau ngày bắt đầu",
        });
      }

      // Check trùng lịch
      const conflict = await Booking.findOne({
        carNumber,
        $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: "Xe đã được đặt trong khoảng thời gian này",
        });
      }

      const days = calculateRentalDays(start, end);
      const totalAmount = days * car.pricePerDay;

      const booking = await Booking.create({
        customerName,
        carNumber,
        startDate: start,
        endDate: end,
        totalAmount,
      });

      // (tuỳ chọn) cập nhật trạng thái xe
      // await Car.updateOne({ carNumber }, { status: 'rented' });

      return res.status(201).json({ success: true, data: booking });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // PUT /api/bookings/:id
  update: async (req, res) => {
    try {
      const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy booking" });
      }

      return res.json({ success: true, data: booking });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/bookings/:id
  delete: async (req, res) => {
    try {
      const booking = await Booking.findByIdAndDelete(req.params.id);
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy booking" });
      }
      return res.json({ success: true, message: "Xóa thành công" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = bookingController;
