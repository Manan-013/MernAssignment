const express = require("express");
const http = require("http");
const reviewRouter = require("./src/routes/review.route");

const app = express();
app.use(express.json());
app.use("/reviews", reviewRouter);

// Start server on an ephemeral port
const server = http.createServer(app);

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: server.address().port,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(data),
        });
      });
    });

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  server.listen(0, async () => {
    console.log(`=== Running Assignment 2 Tests on port ${server.address().port} ===\n`);

    try {
      // Test 1: Sahi body -> 201
      const res1 = await makeRequest("POST", "/reviews/createReview", {
        title: "Bahut accha product",
        comment: "Delivery fast thi aur quality bhi acchi hai",
        rating: 5,
        reviewerName: "Rahul",
      });
      console.log("Test 1 (Valid Body): Status =", res1.statusCode, res1.body.success ? "✓ Passed" : "✗ Failed");

      // Test 2: rating: 9 -> 400 + error message
      const res2 = await makeRequest("POST", "/reviews/createReview", {
        title: "Bahut accha product",
        comment: "Delivery fast thi aur quality bhi acchi hai",
        rating: 9,
        reviewerName: "Rahul",
      });
      console.log("Test 2 (Rating = 9): Status =", res2.statusCode, "Errors =", res2.body.errors);

      // Test 3: title bheja hi nahi -> 400
      const res3 = await makeRequest("POST", "/reviews/createReview", {
        comment: "Delivery fast thi aur quality bhi acchi hai",
        rating: 5,
        reviewerName: "Rahul",
      });
      console.log("Test 3 (Missing title): Status =", res3.statusCode, "Errors =", res3.body.errors);

      // Test 4: ?limit=500 -> 400 (max 20)
      const res4 = await makeRequest("GET", "/reviews/getReviews?limit=500");
      console.log("Test 4 (limit=500): Status =", res4.statusCode, "Errors =", res4.body.errors);

      // Test 5: ?limit=5 (string) -> should convert to number 5
      const res5 = await makeRequest("GET", "/reviews/getReviews?limit=5");
      console.log(
        "Test 5 (limit=5 type coercion): Status =",
        res5.statusCode,
        "Limit type in controller =",
        typeof res5.body.query.limit,
        "value =",
        res5.body.query.limit
      );

      // Test 6: Extra field {"hacked": true} in body -> stripped, no error, saved clean
      const res6 = await makeRequest("POST", "/reviews/createReview", {
        title: "Bahut accha product",
        comment: "Delivery fast thi aur quality bhi acchi hai",
        rating: 5,
        reviewerName: "Rahul",
        hacked: true,
        status: "approved", // should also be stripped
      });
      console.log(
        "Test 6 (stripUnknown check): Status =",
        res6.statusCode,
        "hacked field exists? =",
        "hacked" in res6.body.data,
        "status field exists? =",
        "status" in res6.body.data
      );

      // Test 7 (Bonus): minRating=4 & maxRating=2 -> Should fail since maxRating must be greater than minRating
      const res7 = await makeRequest("GET", "/reviews/getReviews?minRating=4&maxRating=2");
      console.log("Test 7 (Bonus - maxRating < minRating): Status =", res7.statusCode, "Errors =", res7.body.errors);

      // Test 8 (Bonus): minRating=2 & maxRating=4 -> Should pass
      const res8 = await makeRequest("GET", "/reviews/getReviews?minRating=2&maxRating=4");
      console.log("Test 8 (Bonus - maxRating > minRating): Status =", res8.statusCode, "Query =", res8.body.query);

    } catch (e) {
      console.error("Test execution error:", e);
    } finally {
      server.close(() => {
        console.log("\n=== Assignment 2 Tests Finished ===");
      });
    }
  });
}

runTests();
