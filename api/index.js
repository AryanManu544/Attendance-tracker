const app = require("../Backend/server"); // Import the Express app
const serverless = require("@vercel/node");

module.exports = serverless(app);
