const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const { userData } = require("../middleware/authMiddleware");

require("dotenv").config();

module.exports = {
  async index(req,res) {

  },
  async create(req, res) {
    const user = await userData(req, res);
    const content = req.body.content;
    const image = req.body.image;
    if (image || content) {
      const post = await Post.create({
        user: {
          id:user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        content: content,
        image: image,
        date: Date.now(),
      });

      res.status(201).json({ post });
    } else {
      res.status(400).json("post Can't be empty");
    }
  },

};
