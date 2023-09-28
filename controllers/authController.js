const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  async register(req, res) {
    const { name, email, password } = req.body;
    const image = req.body.image || "no-image.png";

    try {
      const user = await User.create({ name, email, password, image });
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ ...user._doc, jwt: token });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ ...user._doc, jwt: token });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },
  async logout(req, res) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({});
  },
};

function handleErrors(err) {
  let errors = { email: "", password: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: maxAge,
  });
};
