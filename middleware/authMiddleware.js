const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const requireAuth = (req, res, next) => {
  const BearerToken = req.headers.authorization;
  // check json web token exists & is verified
  if (BearerToken) {
    const token = BearerToken.split(" ")[1];
    jwt.verify(token, process.env.TOKEN, (err, decodedToken) => {
      if (err) {
        res.status(401).json("User not Found");
      } else {
        next();
      }
    });
  } else {
    res.status(401).json("User not Found");
  }
};

const userData = async (req, res) => {
  const BearerToken = req.headers.authorization;

  if (BearerToken) {
    const token = BearerToken.split(" ")[1];
    let userId = "";
    jwt.verify(token, process.env.TOKEN, (err, decodedToken) => {
      userId = decodedToken.id;
    });
    try {
      const user = await User.findById(userId).exec();
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    } catch (error) {
      res.status(401).json("User not Found");
    }
  } else {
    res.status(401).json("User not Found");
  }
};

module.exports = { requireAuth, userData };
