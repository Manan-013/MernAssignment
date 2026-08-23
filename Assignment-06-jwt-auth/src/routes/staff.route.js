const express = require("express");
const router = express.Router();
const staffController = require("../controller/staffController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /staff/register
router.post("/register", staffController.registerStaff);

// POST /staff/login
router.post("/login", staffController.loginStaff);

// GET /staff/me (Protected route)
router.get("/me", authMiddleware, staffController.getMe);

// POST /staff/logout
router.post("/logout", staffController.logoutStaff);

module.exports = router;
