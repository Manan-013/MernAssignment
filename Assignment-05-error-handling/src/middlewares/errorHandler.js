const { notFound: notFoundError } = require("../utils/apiError");

const notFound = (req, res, next) => {
  next(notFoundError(`Cannot find ${req.originalUrl} on this server`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for '${err.path}'`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((el) => el.message);
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    message = `This ${field} already exists`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  const response = {
    success: false,
    message,
    errors,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};
