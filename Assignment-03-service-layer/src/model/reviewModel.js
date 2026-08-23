const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required and cannot be empty"],
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [80, "Title cannot exceed 80 characters"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Comment is required and cannot be empty"],
      minlength: [10, "Comment must be at least 10 characters long"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
      trim: true,
      validate: {
        validator: function (v) {
          return v && v.trim().length > 0;
        },
        message: "Comment cannot be empty or consist only of whitespace",
      },
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number (decimal values like {VALUE} are not allowed)",
      },
    },
    reviewerName: {
      type: String,
      required: [true, "Reviewer name is required"],
      minlength: [2, "Reviewer name must be at least 2 characters long"],
      maxlength: [50, "Reviewer name cannot exceed 50 characters"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: [0, "Helpful count cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const ReviewModel = mongoose.model("review", reviewSchema);

module.exports = ReviewModel;
