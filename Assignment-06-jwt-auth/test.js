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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/assignment6_test");
    console.log("Connected to MongoDB for tests.");
    await mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.log("MongoDB connection failed. Skipping DB tests.");
    process.exit(0);
  }

  server.listen(0, async () => {
    console.log("Running tests...\n");

    try {
      const registerData = {
        name: "Test Staff",
        email: "staff@company.com",
        password: "securepassword123",
        department: "support",
      };

      const res1 = await makeRequest("POST", "/staff/register", registerData);
      console.log("Test 1 status:", res1.statusCode);

      const res2 = await makeRequest("POST", "/staff/register", registerData);
      console.log("Test 2 status:", res2.statusCode);

      const res3 = await makeRequest("POST", "/staff/login", {
        email: "staff@company.com",
        password: "wrongpassword",
      });
      console.log("Test 3 status:", res3.statusCode);

      const res4 = await makeRequest("POST", "/staff/login", {
        email: "staff@company.com",
        password: "securepassword123",
      });
      const setCookieHeader = res4.headers["set-cookie"] || [];
      const tokenCookie = setCookieHeader.find(cookie => cookie.startsWith("token="));
      console.log("Test 4 status:", res4.statusCode, "cookie exists:", !!tokenCookie);

      const cookieString = tokenCookie ? tokenCookie.split(";")[0] : "";

      const res5 = await makeRequest("GET", "/staff/me");
      console.log("Test 5 status:", res5.statusCode);

      const res6 = await makeRequest("GET", "/staff/me", null, cookieString);
      console.log("Test 6 status:", res6.statusCode, "user name:", res6.body.data?.name);

    } catch (e) {
      console.error(e);
    } finally {
      await mongoose.disconnect();
      server.close();
    }
  });
}

runTests();
