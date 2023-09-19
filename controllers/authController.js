const User = require("../models/User");

module.exports = {
  async register(req, res) {
    const { name, email, password } = req.body;
    const image = req.body.image || "no-image.png";

    try {
      const user = await User.create({ name, email, password, image });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  },
  login(req, res) {
    console.log("hello login");
  },
};
