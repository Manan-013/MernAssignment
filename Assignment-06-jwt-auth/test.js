const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const mongoose = require("mongoose");
const staffRouter = require("./src/routes/staff.route");
const { errorHandler } = require("./src/middlewares/errorHandler");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/staff", staffRouter);
app.use(errorHandler);

const server = http.createServer(app);

function makeRequest(method, path, body = null, requestCookie = null) {
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

    if (requestCookie) {
      options.headers["Cookie"] = requestCookie;
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
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
  // Connect to local MongoDB
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/assignment6_test");
    console.log("Connected to MongoDB for tests.");
    // Clear test collection
    await mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.log("\n[WARNING] Could not connect to local MongoDB. Skipping active DB tests. Make sure MongoDB is running locally to test.");
    process.exit(0);
  }

  server.listen(0, async () => {
    console.log(`=== Running Assignment 6 Tests on port ${server.address().port} ===\n`);

    try {
      const registerData = {
        name: "Test Staff",
        email: "staff@company.com",
        password: "securepassword123",
        department: "support",
      };

      // 1. Register sahi data -> 201
      const res1 = await makeRequest("POST", "/staff/register", registerData);
      console.log("Test 1 (Register 201): Status =", res1.statusCode, "Password returned? =", "password" in (res1.body.data || {}));

      // 2. Register same email again -> 409
      const res2 = await makeRequest("POST", "/staff/register", registerData);
      console.log("Test 2 (Register duplicate 409): Status =", res2.statusCode, "Message =", res2.body.message);

      // 3. Login invalid credentials -> 401
      const res3 = await makeRequest("POST", "/staff/login", {
        email: "staff@company.com",
        password: "wrongpassword",
      });
      console.log("Test 3 (Login incorrect pass 401): Status =", res3.statusCode, "Message =", res3.body.message);

      // 4. Login sahi credentials -> 200 + cookie set
      const res4 = await makeRequest("POST", "/staff/login", {
        email: "staff@company.com",
        password: "securepassword123",
      });
      const setCookieHeader = res4.headers["set-cookie"] || [];
      const tokenCookie = setCookieHeader.find(cookie => cookie.startsWith("token="));
      console.log("Test 4 (Login success 200): Status =", res4.statusCode, "Cookie set? =", !!tokenCookie);

      // Extract cookie value for subsequent requests
      const cookieString = tokenCookie ? tokenCookie.split(";")[0] : "";

      // 5. GET /staff/me without login/cookie -> 401
      const res5 = await makeRequest("GET", "/staff/me");
      console.log("Test 5 (GetMe without token 401): Status =", res5.statusCode, "Message =", res5.body.message);

      // 6. GET /staff/me with valid login cookie -> 200
      const res6 = await makeRequest("GET", "/staff/me", null, cookieString);
      console.log("Test 6 (GetMe with token 200): Status =", res6.statusCode, "Name =", res6.body.data?.name);

      // 7. GET /staff/me with invalid token (modifying cookie) -> 401
      const res7 = await makeRequest("GET", "/staff/me", null, cookieString + "hacked");
      console.log("Test 7 (GetMe with modified token 401): Status =", res7.statusCode, "Message =", res7.body.message);

      // 8. Logout -> 200 + clear cookie
      const res8 = await makeRequest("POST", "/staff/logout", null, cookieString);
      console.log("Test 8 (Logout 200): Status =", res8.statusCode, "Cookies in response =", res8.headers["set-cookie"]);

    } catch (e) {
      console.error("Test execution error:", e);
    } finally {
      await mongoose.disconnect();
      server.close(() => {
        console.log("\n=== Assignment 6 Tests Finished ===");
      });
    }
  });
}

runTests();
