const { notFound: notFoundError } = require("../utils/apiError");

/**
 * Middleware to catch unmatched routes and forward a 404 error
 */
const notFound = (req, res, next) => {
  next(notFoundError(`Cannot find ${req.originalUrl} on this server`));
};

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  // Mongoose CastError (invalid ObjectId format, etc.)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for '${err.path}'`;
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((el) => el.message);
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    // Attempt to extract the duplicate key name
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    message = `This ${field} already exists`;
  }

  // JWT Errors (Bonus)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Build uniform error response structure
  const response = {
    success: false,
    message,
    errors,
  };

  // Only include stack trace if NOT in production
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};
