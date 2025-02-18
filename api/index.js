const app = require("../Backend/server"); 
const serverless = require("serverless-http");

module.exports = serverless(app);