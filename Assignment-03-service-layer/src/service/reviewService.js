const ReviewModel = require("../model/reviewModel");

/**
 * Creates a new review after verifying no duplicate exists by same reviewer and title.
 * @param {Object} data 
 * @returns {Promise<Object>} The created Mongoose review document
 */
async function createReview(data) {
  const { title, comment, rating, reviewerName } = data;

  // Check for duplicate review (same reviewer name and title)
  const alreadyReviewed = await ReviewModel.findOne({ reviewerName, title });
  if (alreadyReviewed) {
    const error = new Error("aap ye review pehle de chuke ho");
    error.statusCode = 409; // Conflict (or 400 as per PDF, we will address this in answers.md)
    throw error;
  }

  return await ReviewModel.create({
    title,
    comment,
    rating,
    reviewerName,
  });
}

/**
 * Gets reviews with filters, pagination, and sorting.
 * @param {Object} queryParams 
 * @returns {Promise<Object>} { reviews, total, page, totalPages }
 */
async function getReviews(queryParams = {}) {
  const { status, minRating, maxRating, page = 1, limit = 10, sortBy } = queryParams;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  // Handle rating range filters
  if (minRating || maxRating) {
    filter.rating = {};
    if (minRating !== undefined) filter.rating.$gte = Number(minRating);
    if (maxRating !== undefined) filter.rating.$lte = Number(maxRating);
  }

  // Handle sorting (Only 'rating' and 'createdAt' are allowed)
  const sort = {};
  if (sortBy) {
    const parts = sortBy.split(":");
    const sortField = parts[0];
    const sortOrder = parts[1] === "desc" ? -1 : 1;

    if (["rating", "createdAt"].includes(sortField)) {
      sort[sortField] = sortOrder;
    }
  } else {
    sort.createdAt = -1; // Default sort
  }

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Concurrently run find query and count query for performance
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
