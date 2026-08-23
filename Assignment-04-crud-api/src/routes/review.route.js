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

// GET /getSingleReview/:id
router.get(
  "/getSingleReview/:id",
  validationMiddleware(reviewIdSchema, "params"),
  reviewController.getSingleReview
);

// PATCH /updateReview/:id
router.patch(
  "/updateReview/:id",
  validationMiddleware(reviewIdSchema, "params"),
  validationMiddleware(updateReviewSchema, "body"),
  reviewController.updateReview
);

// DELETE /deleteReview/:id
router.delete(
  "/deleteReview/:id",
  validationMiddleware(reviewIdSchema, "params"),
  reviewController.deleteReview
);

// Bonus: PATCH /approveReview/:id
router.patch(
  "/approveReview/:id",
  validationMiddleware(reviewIdSchema, "params"),
  reviewController.approveReview
);

module.exports = router;
