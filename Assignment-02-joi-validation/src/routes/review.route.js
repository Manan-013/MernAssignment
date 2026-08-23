const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const validationMiddleware = require("../middleware/validationMiddleware");
const {
  createReviewSchema,
  getReviewsSchema,
  reviewIdSchema,
  updateReviewSchema,
} = require("../validationSchema/reviewValidationSchema");

// POST /createReview
router.post(
  "/createReview",
  validationMiddleware(createReviewSchema, "body"),
  reviewController.createReview
);

// GET /getReviews
router.get(
  "/getReviews",
  validationMiddleware(getReviewsSchema, "query"),
  reviewController.getReviews
);

// PATCH /updateReview/:id
router.patch(
  "/updateReview/:id",
  validationMiddleware(reviewIdSchema, "params"),
  validationMiddleware(updateReviewSchema, "body"),
  reviewController.updateReview
);

module.exports = router;
