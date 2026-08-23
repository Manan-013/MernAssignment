const express = require("express");
const mongoose = require("mongoose");
const { errorHandler, notFound } = require("./src/middlewares/errorHandler");

const app = express();
app.use(express.json());

const ReviewModel = mongoose.models.review || mongoose.model("review", new mongoose.Schema({
  title: String,
  comment: String,
  rating: Number,
  reviewerName: String
}));

const reviewRouter = express.Router();

// FIXED: added try-catch block and return statement for 404 response
const getReview = async (req, res, next) => {
  try {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    return res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

reviewRouter.get("/:id", getReview);

// FIXED: routes declaration should be before error handlers
app.use("/reviews", reviewRouter);

app.use(notFound);

// FIXED: error handler middleware should have 4 parameters
app.use(errorHandler);

module.exports = app;
