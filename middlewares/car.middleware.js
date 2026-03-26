// Car validation middleware

exports.validateCreateCar = (req, res, next) => {
  try {
    let { carNumber, capacity, pricePerDay, status, features } = req.body;

    // 1. Check required fields
    if (!carNumber || !capacity || pricePerDay === undefined) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin (Biển số xe, Sức chứa, Giá)",
      });
    }

    // 2. Validate car number
    carNumber = String(carNumber).trim().toUpperCase();
    if (carNumber.length < 3 || carNumber.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Biển số xe phải từ 3 - 20 ký tự",
      });
    }

    // 3. Validate capacity
    capacity = parseInt(capacity);
    if (isNaN(capacity) || capacity < 2 || capacity > 20) {
      return res.status(400).json({
        success: false,
        message: "Sức chứa phải từ 2 đến 20 chỗ",
      });
    }

    // 4. Validate price
    pricePerDay = parseFloat(pricePerDay);
    if (isNaN(pricePerDay) || pricePerDay < 0 || pricePerDay > 100000000) {
      return res.status(400).json({
        success: false,
        message: "Giá phải là số dương hợp lệ",
      });
    }

    // 5. Validate status
    const validStatuses = ["available", "rented", "maintenance"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái phải là: ${validStatuses.join(", ")}`,
      });
    }

    // 6. Validate features
    let cleanedFeatures = [];
    if (features && Array.isArray(features)) {
      cleanedFeatures = features
        .map((f) => String(f).trim())
        .filter((f) => f && f.length > 0 && f.length <= 50);

      if (cleanedFeatures.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Tối đa 10 tính năng",
        });
      }
    }

    // Store cleaned values
    req.body.carNumber = carNumber;
    req.body.capacity = capacity;
    req.body.pricePerDay = pricePerDay;
    req.body.status = status || "available";
    req.body.features = cleanedFeatures;

    next();
  } catch (error) {
    console.error("Car create validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Lỗi xác thực dữ liệu xe",
    });
  }
};

exports.validateUpdateCar = (req, res, next) => {
  try {
    // 1. Validate car ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID xe không hợp lệ",
      });
    }

    // 2. Check body has data
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    // 3. Validate carNumber if provided
    if (req.body.carNumber) {
      req.body.carNumber = String(req.body.carNumber).trim().toUpperCase();
      if (req.body.carNumber.length < 3 || req.body.carNumber.length > 20) {
        return res.status(400).json({
          success: false,
          message: "Biển số xe phải từ 3 - 20 ký tự",
        });
      }
    }

    // 4. Validate capacity if provided
    if (req.body.capacity !== undefined) {
      req.body.capacity = parseInt(req.body.capacity);
      if (
        isNaN(req.body.capacity) ||
        req.body.capacity < 2 ||
        req.body.capacity > 20
      ) {
        return res.status(400).json({
          success: false,
          message: "Sức chứa phải từ 2 đến 20 chỗ",
        });
      }
    }

    // 5. Validate price if provided
    if (req.body.pricePerDay !== undefined) {
      req.body.pricePerDay = parseFloat(req.body.pricePerDay);
      if (
        isNaN(req.body.pricePerDay) ||
        req.body.pricePerDay < 0 ||
        req.body.pricePerDay > 100000000
      ) {
        return res.status(400).json({
          success: false,
          message: "Giá phải là số dương hợp lệ",
        });
      }
    }

    // 6. Validate status if provided
    if (req.body.status) {
      const validStatuses = ["available", "rented", "maintenance"];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: `Trạng thái phải là: ${validStatuses.join(", ")}`,
        });
      }
    }

    // 7. Validate features if provided
    if (req.body.features && Array.isArray(req.body.features)) {
      req.body.features = req.body.features
        .map((f) => String(f).trim())
        .filter((f) => f && f.length > 0 && f.length <= 50);

      if (req.body.features.length > 10) {
        return res.status(400).json({
          success: false,
          message: "Tối đa 10 tính năng",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Car update validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Lỗi xác thực dữ liệu xe",
    });
  }
};

exports.validateDeleteCar = (req, res, next) => {
  try {
    // Validate car ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID xe không hợp lệ",
      });
    }

    next();
  } catch (error) {
    console.error("Car delete validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Lỗi xác thực ID xe",
    });
  }
};
