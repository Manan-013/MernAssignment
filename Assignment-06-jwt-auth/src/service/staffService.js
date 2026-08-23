const StaffModel = require("../model/staffModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-12345";

/**
 * Registers a new staff member.
 */
async function registerStaff(data) {
  const { name, email, password, department } = data;

  const existingStaff = await StaffModel.findOne({ email });
  if (existingStaff) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  // Create staff (hashing will happen in pre-save hook)
  const staff = await StaffModel.create({
    name,
    email,
    password,
    department,
  });

  // Convert to object and sanitize password out
  const staffObj = staff.toObject();
  delete staffObj.password;
  return staffObj;
}

/**
 * Logs in a staff member and signs a JWT token.
 */
async function loginStaff(email, password) {
  if (!email || !password) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const staff = await StaffModel.findOne({ email });
  if (!staff) {
    // Return generic error for security (prevents user enumeration)
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, staff.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT token containing id and department
  const token = jwt.sign(
    { id: staff._id, department: staff.department },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const staffObj = staff.toObject();
  delete staffObj.password;

  return { token, staff: staffObj };
}

module.exports = {
  registerStaff,
  loginStaff,
  JWT_SECRET,
};
