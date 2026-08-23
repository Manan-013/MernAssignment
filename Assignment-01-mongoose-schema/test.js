const mongoose = require("mongoose");
const ReviewModel = require("./src/model/reviewModel");

async function runTests() {
  console.log("=== Running Assignment 1 Tests ===\n");

  // Test Case 1: Sahi data (should pass validation)
  const validData = {
    title: "Bahut accha product",
    comment: "Delivery fast thi aur quality bhi acchi hai",
    rating: 5,
    reviewerName: "Rahul",
  };
  try {
    const doc1 = new ReviewModel(validData);
    await doc1.validate();
    console.log("✓ Test 1 Passed: Valid data validated successfully.");
  } catch (err) {
    console.error("✗ Test 1 Failed:", err.message);
  }

  // Test Case 2: rating = 6 (should fail)
  try {
    const doc2 = new ReviewModel({
      ...validData,
      rating: 6,
    });
    await doc2.validate();
    console.error("✗ Test 2 Failed: rating = 6 should have thrown an error but didn't.");
  } catch (err) {
    console.log("✓ Test 2 Passed (Expected Error):", err.errors.rating?.message);
  }

  // Test Case 3: rating = 3.5 (should fail)
  try {
    const doc3 = new ReviewModel({
      ...validData,
      rating: 3.5,
    });
    await doc3.validate();
    console.error("✗ Test 3 Failed: rating = 3.5 should have thrown an error but didn't.");
  } catch (err) {
    console.log("✓ Test 3 Passed (Expected Error):", err.errors.rating?.message);
  }

  // Test Case 4: status = "blocked" (should fail)
  try {
    const doc4 = new ReviewModel({
      ...validData,
      status: "blocked",
    });
    await doc4.validate();
    console.error("✗ Test 4 Failed: status = 'blocked' should have thrown an error but didn't.");
  } catch (err) {
    console.log("✓ Test 4 Passed (Expected Error):", err.errors.status?.message);
  }

  // Bonus Test Case 5: Empty space comment (should fail)
  try {
    const doc5 = new ReviewModel({
      ...validData,
      comment: "         ",
    });
    await doc5.validate();
    console.error("✗ Test 5 Failed: Empty space comment should have thrown an error but didn't.");
  } catch (err) {
    console.log("✓ Test 5 Passed (Expected Error):", err.errors.comment?.message);
  }

  // Bonus Test Case 6: Negative helpfulCount (should fail)
  try {
    const doc6 = new ReviewModel({
      ...validData,
      helpfulCount: -5,
    });
    await doc6.validate();
    console.error("✗ Test 6 Failed: Negative helpfulCount should have thrown an error but didn't.");
  } catch (err) {
    console.log("✓ Test 6 Passed (Expected Error):", err.errors.helpfulCount?.message);
  }

  console.log("\n=== Assignment 1 Tests Finished ===");
}

runTests();
