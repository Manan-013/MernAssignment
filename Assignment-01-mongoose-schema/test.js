const mongoose = require("mongoose");
const ReviewModel = require("./src/model/reviewModel");

async function runTests() {
  console.log("Running tests...\n");

  const validData = {
    title: "Bahut accha product",
    comment: "Delivery fast thi aur quality bhi acchi hai",
    rating: 5,
    reviewerName: "Rahul",
  };

  // Test 1: Sahi data
  try {
    const doc1 = new ReviewModel(validData);
    await doc1.validate();
    console.log("Test 1 passed (valid data)");
  } catch (err) {
    console.log("Test 1 failed:", err.message);
  }

  // Test 2: rating = 6
  try {
    const doc2 = new ReviewModel({ ...validData, rating: 6 });
    await doc2.validate();
    console.log("Test 2 failed: rating = 6 passed validation");
  } catch (err) {
    console.log("Test 2 passed (rating = 6 rejected):", err.errors.rating?.message);
  }

  // Test 3: rating = 3.5
  try {
    const doc3 = new ReviewModel({ ...validData, rating: 3.5 });
    await doc3.validate();
    console.log("Test 3 failed: rating = 3.5 passed validation");
  } catch (err) {
    console.log("Test 3 passed (rating = 3.5 rejected):", err.errors.rating?.message);
  }

  // Test 4: status = "blocked"
  try {
    const doc4 = new ReviewModel({ ...validData, status: "blocked" });
    await doc4.validate();
    console.log("Test 4 failed: status = blocked passed validation");
  } catch (err) {
    console.log("Test 4 passed (status = blocked rejected):", err.errors.status?.message);
  }

  // Test 5: empty comment spaces
  try {
    const doc5 = new ReviewModel({ ...validData, comment: "         " });
    await doc5.validate();
    console.log("Test 5 failed: empty spaces comment passed");
  } catch (err) {
    console.log("Test 5 passed (empty spaces comment rejected):", err.errors.comment?.message);
  }
}

runTests();
