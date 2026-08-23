const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: [3, "title must be at least 3 characters"],
      maxlength: [80, "title cannot exceed 80 characters"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "comment is required"],
      minlength: [10, "comment must be at least 10 characters"],
      maxlength: [500, "comment cannot exceed 500 characters"],
      trim: true,
      validate: {
        validator: function (v) {
          return v && v.trim().length > 0;
        },
        message: "comment cannot be empty spaces",
      },
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [1, "rating must be between 1 and 5"],
      max: [5, "rating must be between 1 and 5"],
      validate: {
        validator: Number.isInteger,
        message: "rating must be an integer",
      },
    },
    reviewerName: {
      type: String,
      required: [true, "reviewerName is required"],
      minlength: [2, "reviewerName must be at least 2 characters"],
      maxlength: [50, "reviewerName cannot exceed 50 characters"],
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
      min: [0, "helpfulCount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("review", reviewSchema);
