// Auth validation middleware

exports.validateRegister = (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;

    // 1. Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin (Username, Email, Password)",
      });
    }

    // 2. Validate username
    username = String(username).trim();
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Username phải từ 3 - 50 ký tự",
      });
    }

    // Username only contains letters, numbers, underscore
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: "Username chỉ chứa chữ, số và gạch dưới",
      });
    }

    // 3. Validate email
    email = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ",
      });
    }

    if (email.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Email không được vượt quá 100 ký tự",
      });
    }

    // 4. Validate password
    password = String(password);
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password phải từ 6 - 128 ký tự",
      });
    }

    // 5. Validate role if provided
    const validRoles = ["admin", "customer"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role phải là: ${validRoles.join(" hoặc ")}`,
      });
    }

    // Store cleaned values
    req.body.username = username;
    req.body.email = email;
    req.body.password = password;
    req.body.role = role || "customer";

    next();
  } catch (error) {
    console.error("Register validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Lỗi xác thực dữ liệu đăng ký",
    });
  }
};

exports.validateLogin = (req, res, next) => {
  try {
    let { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và password",
      });
    }

    // 2. Validate email format
    email = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không hợp lệ",
      });
    }

    // 3. Validate password is not empty
    password = String(password);
    if (password.length === 0 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password không hợp lệ",
      });
    }

    // Store cleaned values
    req.body.email = email;
    req.body.password = password;

    next();
  } catch (error) {
    console.error("Login validation error:", error);
    return res.status(400).json({
      success: false,
      message: "Lỗi xác thực dữ liệu đăng nhập",
    });
  }
};
