const jwt = require("jsonwebtoken");
const StaffModel = require("../model/staffModel");
const { JWT_SECRET } = require("../service/staffService");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Read token from cookies
    const token = req.cookies?.token;
    if (!token) {
      const error = new Error("Authentication token is missing");
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 401;
      throw error;
    }

    // 3. Retrieve staff details from database (password excluded)
    const staff = await StaffModel.findById(decoded.id).select("-password");
    if (!staff) {
      const error = new Error("Staff member not found");
      error.statusCode = 401;
      throw error;
    }

    // 4. Attach staff details to request object
    req.user = staff;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
