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
        console.log(err.message);
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.json("User not Found");
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
    const user = await User.findById(userId).exec();
    return {
      id:user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  }
};

module.exports = { requireAuth, userData };
