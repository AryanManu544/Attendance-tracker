const app = require("../server"); // Import the Express app
const serverless = require("@vercel/node");

module.exports = serverless(app);
