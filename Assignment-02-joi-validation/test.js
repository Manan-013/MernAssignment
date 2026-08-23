const express = require("express");
const http = require("http");
const reviewRouter = require("./src/routes/review.route");

const app = express();
app.use(express.json());
app.use("/reviews", reviewRouter);

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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  server.listen(0, async () => {
    console.log("Running tests...\n");

    try {
      const res1 = await makeRequest("POST", "/reviews/createReview", {
        title: "Bahut accha product",
        comment: "Delivery fast thi aur quality bhi acchi hai",
        rating: 5,
        reviewerName: "Rahul",
      });
      console.log("Test 1 status:", res1.statusCode);

      const res2 = await makeRequest("POST", "/reviews/createReview", {
        title: "Bahut accha product",
        comment: "Delivery fast thi aur quality bhi acchi hai",
        rating: 9,
        reviewerName: "Rahul",
      });
      console.log("Test 2 status:", res2.statusCode, "errors:", res2.body.errors);

      const res3 = await makeRequest("POST", "/reviews/createReview", {
        comment: "Delivery fast thi aur quality bhi acchi hai",
        rating: 5,
        reviewerName: "Rahul",
      });
      console.log("Test 3 status:", res3.statusCode, "errors:", res3.body.errors);

      const res4 = await makeRequest("GET", "/reviews/getReviews?limit=500");
      console.log("Test 4 status:", res4.statusCode, "errors:", res4.body.errors);

      const res5 = await makeRequest("GET", "/reviews/getReviews?limit=5");
      console.log("Test 5 limit type:", typeof res5.body.query.limit);

      const res6 = await makeRequest("POST", "/reviews/createReview", {
        title: "Bahut accha product",
        comment: "Delivery fast thi aur quality bhi acchi hai",
        rating: 5,
        reviewerName: "Rahul",
        hacked: true,
      });
      console.log("Test 6 hacked field exists?:", "hacked" in res6.body.data);

    } catch (e) {
      console.error(e);
    } finally {
      server.close();
    }
  });
}

runTests();
