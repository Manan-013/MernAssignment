const createReview = (req, res) => {
  // Echo back the body to verify stripUnknown and type conversion
  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: req.body,
  });
};

const getReviews = (req, res) => {
  // Echo back query to verify pagination defaults, type conversions, and stripUnknown
  res.status(200).json({
    success: true,
    message: "Reviews retrieved successfully",
    query: req.query,
  });
};

const updateReview = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    id: req.params.id,
    data: req.body,
  });
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
};
