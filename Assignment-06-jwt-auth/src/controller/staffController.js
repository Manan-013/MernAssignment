const staffService = require("../service/staffService");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const registerStaff = asyncHandler(async (req, res) => {
  const data = await staffService.registerStaff(req.body);
  res.status(201).json({ success: true, message: "Staff registered successfully", data });
});

const loginStaff = asyncHandler(async (req, res) => {
  const { token, staff } = await staffService.loginStaff(req.body.email, req.body.password);
  res.cookie("token", token, { httpOnly: true })
     .status(200)
     .json({ success: true, message: "Logged in successfully", data: staff });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

const logoutStaff = asyncHandler(async (req, res) => {
  res.clearCookie("token", { httpOnly: true })
     .status(200)
     .json({ success: true, message: "Logged out successfully" });
});

module.exports = {
  registerStaff,
  loginStaff,
  getMe,
  logoutStaff,
};
