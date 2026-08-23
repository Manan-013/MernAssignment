const reviewService = require("../service/reviewService");

// Helper to catch async errors and pass them to Express error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const createReview = asyncHandler(async (req, res) => {
  const data = await reviewService.createReview(req.body);
  res.status(201).json({ success: true, message: "Review created successfully", data });
});

const getReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.getReviews(req.query);
  res.status(200).json({ success: true, message: "Reviews retrieved successfully", data });
});

module.exports = {
  createReview,
  getReviews,
};
