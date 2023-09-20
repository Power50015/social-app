const User = require("../models/User");

module.exports = {
  async register(req, res) {
    const { name, email, password } = req.body;
    const image = req.body.image || "no-image.png";

    try {
      const user = await User.create({ name, email, password, image });
      res.status(201).json(user);
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  },
  login(req, res) {
    console.log("hello login");
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
