const Joi = require("joi");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// ye kaunsi API ke liye hai: POST /createReview
const createReviewSchema = Joi.object({
  title: Joi.string().trim().min(3).max(80).required(),
  comment: Joi.string().trim().min(10).max(500).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  reviewerName: Joi.string().trim().min(2).max(50).required(),
});

// ye kaunsi API ke liye hai: GET /getReviews
const getReviewsSchema = Joi.object({
  status: Joi.string().valid("pending", "approved", "rejected").optional(),
  minRating: Joi.number().min(1).max(5).optional(),
  maxRating: Joi.number()
    .min(1)
    .max(5)
    .optional()
    .greater(Joi.ref("minRating")),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(20).default(10).optional(),
});

// ye kaunsi API ke liye hai: reviewById check
const reviewIdSchema = Joi.object({
  id: Joi.string().regex(objectIdPattern).required(),
});

// ye kaunsi API ke liye hai: PATCH /updateReview/:id
const updateReviewSchema = Joi.object({
  title: Joi.string().trim().min(3).max(80).optional(),
  comment: Joi.string().trim().min(10).max(500).optional(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  reviewerName: Joi.string().trim().min(2).max(50).optional(),
})
  .min(1);

module.exports = {
  createReviewSchema,
  getReviewsSchema,
  reviewIdSchema,
  updateReviewSchema,
};
