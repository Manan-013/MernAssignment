const reviewService = require("../service/reviewService");

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

const getSingleReview = asyncHandler(async (req, res) => {
  const data = await reviewService.getSingleReview(req.params.id);
  res.status(200).json({ success: true, message: "Review retrieved successfully", data });
});

const updateReview = asyncHandler(async (req, res) => {
  const data = await reviewService.updateReview(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Review updated successfully", data });
});

const deleteReview = asyncHandler(async (req, res) => {
  const data = await reviewService.deleteReview(req.params.id);
  res.status(200).json({ success: true, message: "Review deleted successfully", data });
});

const approveReview = asyncHandler(async (req, res) => {
  const data = await reviewService.approveReview(req.params.id);
  res.status(200).json({ success: true, message: "Review approved successfully", data });
});

module.exports = {
  createReview,
  getReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  approveReview,
};
