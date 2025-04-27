const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header (Bearer <token>)

  if (!token) {
    return res.status(403).json({ message: "Token không tồn tại" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY"); // SECRET_KEY phải khớp với lúc tạo token
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};