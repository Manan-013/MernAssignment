const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");

router.post("/createReview", reviewController.createReview);
router.get("/getReviews", reviewController.getReviews);

module.exports = router;
