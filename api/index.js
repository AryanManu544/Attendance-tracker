const app = require("../Backend/server"); // Correct path to server.js
const serverless = require("serverless-http");

module.exports = serverless(app);
