const ReviewModel = require("../model/reviewModel");

async function createReview(data) {
  const { title, comment, rating, reviewerName } = data;

  const alreadyReviewed = await ReviewModel.findOne({ reviewerName, title });
  if (alreadyReviewed) {
    const error = new Error("aap ye review pehle de chuke ho");
    error.statusCode = 409;
    throw error;
  }

  return await ReviewModel.create({
    title,
    comment,
    rating,
    reviewerName,
  });
}

async function getReviews(queryParams = {}) {
  const { status, minRating, maxRating, page = 1, limit = 10, sortBy } = queryParams;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  if (minRating || maxRating) {
    filter.rating = {};
    if (minRating !== undefined) filter.rating.$gte = Number(minRating);
    if (maxRating !== undefined) filter.rating.$lte = Number(maxRating);
  }

  const sort = {};
  if (sortBy) {
    const parts = sortBy.split(":");
    const sortField = parts[0];
    const sortOrder = parts[1] === "desc" ? -1 : 1;
    if (["rating", "createdAt"].includes(sortField)) {
      sort[sortField] = sortOrder;
    }
  } else {
    sort.createdAt = -1;
  }

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [reviews, total] = await Promise.all([
    ReviewModel.find(filter).sort(sort).skip(skip).limit(parsedLimit),
    ReviewModel.countDocuments(filter),
  ]);

  return {
    reviews,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit) || 1,
  };
}

async function getSingleReview(id) {
  const review = await ReviewModel.findById(id);
  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }
  return review;
}

async function updateReview(id, updateData) {
  const review = await ReviewModel.findById(id);
  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }

  Object.keys(updateData).forEach((key) => {
    review[key] = updateData[key];
  });

  return await review.save();
}

async function deleteReview(id) {
  const deletedReview = await ReviewModel.findByIdAndDelete(id);
  if (!deletedReview) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }
  return deletedReview;
}

async function approveReview(id) {
  const review = await ReviewModel.findById(id);
  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }

  if (review.status === "approved") {
    const error = new Error("Review is already approved");
    error.statusCode = 400;
    throw error;
  }

  review.status = "approved";
  return await review.save();
}

module.exports = {
  createReview,
  getReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  approveReview,
};
