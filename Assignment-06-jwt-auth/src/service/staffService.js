const StaffModel = require("../model/staffModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-12345";

async function registerStaff(data) {
  const { name, email, password, department } = data;

  const existingStaff = await StaffModel.findOne({ email });
  if (existingStaff) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const staff = await StaffModel.create({
    name,
    email,
    password,
    department,
  });

  const staffObj = staff.toObject();
  delete staffObj.password;
  return staffObj;
}

async function loginStaff(email, password) {
  if (!email || !password) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const staff = await StaffModel.findOne({ email });
  if (!staff) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, staff.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

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
