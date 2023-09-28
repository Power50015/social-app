const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.TOKEN, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
