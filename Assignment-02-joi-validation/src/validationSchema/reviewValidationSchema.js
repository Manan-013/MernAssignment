const Joi = require("joi");

// Helper regex to validate 24-character hex MongoDB ObjectId
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * ye kaunsi API ke liye hai: POST /createReview (Create a new review)
 */
const createReviewSchema = Joi.object({
  title: Joi.string().trim().min(3).max(80).required().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 80 characters",
    "any.required": "Title is required",
  }),
  comment: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "Comment cannot be empty",
    "string.min": "Comment must be at least 10 characters long",
    "string.max": "Comment cannot exceed 500 characters",
    "any.required": "Comment is required",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be between 1 and 5",
    "number.max": "Rating must be between 1 and 5",
    "any.required": "Rating is required",
  }),
  reviewerName: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Reviewer name cannot be empty",
    "string.min": "Reviewer name must be at least 2 characters long",
    "string.max": "Reviewer name cannot exceed 50 characters",
    "any.required": "Reviewer name is required",
  }),
});

/**
 * ye kaunsi API ke liye hai: GET /getReviews (Fetch reviews list with filtering & pagination)
 */
const getReviewsSchema = Joi.object({
  status: Joi.string().valid("pending", "approved", "rejected").optional().messages({
    "any.only": "Status must be one of: pending, approved, rejected",
  }),
  minRating: Joi.number().min(1).max(5).optional(),
  maxRating: Joi.number()
    .min(1)
    .max(5)
    .optional()
    .greater(Joi.ref("minRating"))
    .messages({
      "number.greater": "maxRating must be strictly greater than minRating",
    }),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(20).default(10).optional().messages({
    "number.max": "Limit cannot exceed 20",
  }),
});

/**
 * ye kaunsi API ke liye hai: GET /getSingleReview/:id, PATCH /updateReview/:id, DELETE /deleteReview/:id (API targeting specific review by ID)
 */
const reviewIdSchema = Joi.object({
  id: Joi.string().regex(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid MongoDB ObjectId format (must be 24-character hex)",
    "any.required": "Review ID is required",
  }),
});

/**
 * ye kaunsi API ke liye hai: PATCH /updateReview/:id (Update review fields partially)
 */
const updateReviewSchema = Joi.object({
  title: Joi.string().trim().min(3).max(80).optional(),
  comment: Joi.string().trim().min(10).max(500).optional(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  reviewerName: Joi.string().trim().min(2).max(50).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

module.exports = {
  createReviewSchema,
  getReviewsSchema,
  reviewIdSchema,
  updateReviewSchema,
};
