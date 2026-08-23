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

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    reviews,
    total,
    page: parsedPage,
    totalPages: totalPages || 1,
  };
}

module.exports = {
  createReview,
  getReviews,
};
