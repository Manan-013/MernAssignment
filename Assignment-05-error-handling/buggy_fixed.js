const express = require("express");
const mongoose = require("mongoose");
const { errorHandler, notFound } = require("./src/middlewares/errorHandler");

const app = express();
app.use(express.json());

// Mock/Stub Review Model for compilation/execution demonstration
const ReviewModel = mongoose.models.review || mongoose.model("review", new mongoose.Schema({
  title: String,
  comment: String,
  rating: Number,
  reviewerName: String
}));

// Mock Router to represent reviewRouter
const reviewRouter = express.Router();

/**
 * FIX 2: Async controller function wrapped in try/catch or async handler to capture rejection errors.
 * FIX 3: Changed status code to 404 (Not Found) instead of 200 (OK), and added 'return' statement.
 * FIX 4: Adding the return statement prevents executing res.json(review) after res.status(404).json(...),
 *        which would throw "Cannot set headers after they are sent to the client".
 */
const getReview = async (req, res, next) => {
  try {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) {
      // Return immediately with 404
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    return res.status(200).json({ success: true, data: review });
  } catch (err) {
    // Forward Database CastError / connection errors to the central error handler
    next(err);
  }
};

reviewRouter.get("/:id", getReview);

// FIX 1: Mount the application routes BEFORE mounting error handling middlewares!
app.use("/reviews", reviewRouter);

// Mount the 404 fallback handler for unmatched routes
app.use(notFound);

/**
 * FIX 5: Express error-handling middleware MUST have exactly 4 arguments (err, req, res, next).
 *        If a middleware has 3 arguments, Express treats it as a standard router middleware
 *        and it will not capture errors passed down through next(err).
 *        We delegate the error handling directly to our central errorHandler middleware.
 */
app.use(errorHandler);

module.exports = app;
