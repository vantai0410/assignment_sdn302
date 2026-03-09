const Car = require("../models/car.model");

const carController = {
  // GET /api/cars
  getAll: async (req, res) => {
    try {
      const cars = await Car.find().sort({ createdAt: -1 }).lean();
      return res.json(cars);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/cars
  create: async (req, res) => {
    try {
      const { carNumber, capacity, status, pricePerDay, features } = req.body;

      const car = await Car.create({
        carNumber: carNumber.toUpperCase(),
        capacity: parseInt(capacity),
        status: status || "available",
        pricePerDay: parseFloat(pricePerDay),
        features: features || [],
      });

      return res.status(201).json({ success: true, data: car });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // PUT /api/cars/:id
  update: async (req, res) => {
    try {
      const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!car) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy xe" });
      }

      return res.json({ success: true, data: car });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/cars/:id
  delete: async (req, res) => {
    try {
      const car = await Car.findByIdAndDelete(req.params.id);
      if (!car) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy xe" });
      }
      return res.json({ success: true, message: "Xóa thành công" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = carController;
