const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const staffRouter = require("./src/routes/staff.route");
const { errorHandler, notFound } = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/assignment6_auth";

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Base Route
app.use("/staff", staffRouter);

// Fallback for unmatched routes
app.use(notFound);

// Central error handler
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
