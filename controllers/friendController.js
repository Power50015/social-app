const Friend = require("../models/Friend");
const jwt = require("jsonwebtoken");
const { userData } = require("../middleware/authMiddleware");
const User = require("../models/User");

require("dotenv").config();

module.exports = {
};