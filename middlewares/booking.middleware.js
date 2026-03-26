// Booking validation middleware

exports.validateCreateBooking = (req, res, next) => {
  try {
    let { customerName, carNumber, startDate, endDate } = req.body;

    // 1. For customers, auto-use their username as customerName
    if (req.user.role === "customer") {
      customerName = req.user.username;
      req.body.customerName = customerName;
    } else if (!customerName) {
      // For admins, customerName is required
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tên khách hàng",
      });
    } else {
      // Validate customerName if provided by admin
      customerName = String(customerName).trim();
      if (customerName.length < 2 || customerName.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Tên khách hàng phải từ 2 - 100 ký tự",
        });
      }
      req.body.customerName = customerName;
    }

    // 2. Check carNumber is provided
    if (!carNumber) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn xe",
      });
    }

    carNumber = String(carNumber).trim().toUpperCase();
    if (carNumber.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Biển số xe không hợp lệ",
      });
    }
    req.body.carNumber = carNumber;

    // 3. Parse and validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ngày bắt đầu và kết thúc",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Định dạng ngày không hợp lệ. Sử dụng: YYYY-MM-DD",
      });
    }

    // 4. Check start date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return res.status(400).json({
        success: false,
        message: "Ngày bắt đầu không thể là ngày trong quá khứ",
      });
    }

    // 5. Validate date range
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "Ngày kết thúc phải sau ngày bắt đầu ít nhất 1 ngày",
      });
    }

    // 6. Maximum rental period (30 days)
    const diffMs = end - start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      return res.status(400).json({
        success: false,
        message: "Thời gian cho thuê không được vượt quá 30 ngày",
      });
    }

    // Store cleaned values
    req.body.customerName = customerName;
    req.body.carNumber = carNumber;
    req.body.startDate = startDate;
    req.body.endDate = endDate;

    next();
  } catch (error) {
    console.error("Booking create validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Lỗi xác thực dữ liệu booking",
    });
  }
};

exports.validateUpdateBooking = (req, res, next) => {
  try {
    // 1. Validate booking ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn đặt xe không hợp lệ",
      });
    }

    // 2. Validate body is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    // 3. Validate actualReturnDate if provided
    if (req.body.actualReturnDate) {
      const actual = new Date(req.body.actualReturnDate);
      if (isNaN(actual.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Định dạng ngày trả không hợp lệ",
        });
      }
    }

    // 4. Validate customerName if provided
    if (req.body.customerName) {
      const name = String(req.body.customerName).trim();
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Tên khách hàng phải từ 2 - 100 ký tự",
        });
      }
      req.body.customerName = name;
    }

    // 5. Validate totalAmount if provided
    if (req.body.totalAmount !== undefined) {
      if (
        typeof req.body.totalAmount !== "number" ||
        req.body.totalAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Tổng tiền phải là số không âm",
        });
      }
    }

    // 6. Validate penaltyAmount if provided
    if (req.body.penaltyAmount !== undefined) {
      if (
        typeof req.body.penaltyAmount !== "number" ||
        req.body.penaltyAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Phí phạt phải là số không âm",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Booking update validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Lỗi xác thực dữ liệu booking",
    });
  }
};

exports.validateDeleteBooking = (req, res, next) => {
  try {
    // Validate booking ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn đặt xe không hợp lệ",
      });
    }

    next();
  } catch (error) {
    console.error("Booking delete validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Lỗi xác thực ID booking",
    });
  }
};
