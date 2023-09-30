const FriendRequest = require("../models/FriendRequest");
const jwt = require("jsonwebtoken");
const { userData } = require("../middleware/authMiddleware");

require("dotenv").config();

module.exports = {
  async index(req, res) {
    const receiverUser = await userData(req, res);
    
  },
  async create(req, res) {
    const senderUser = await userData(req, res);
    const receiverUser = req.body.user;
    console.log(receiverUser);
    if (receiverUser) {
      const friendRequest = await FriendRequest.create({
        senderUser: {
          id: senderUser.id,
          name: senderUser.name,
          email: senderUser.email,
          image: senderUser.image,
        },
        receiverUser: {
          id: receiverUser.id,
          name: receiverUser.name,
          email: receiverUser.email,
          image: receiverUser.image,
        },
        date: Date.now(),
      });

      res.status(201).json({ friendRequest });
    } else {
      res.status(400).json("post Can't be empty");
    }
  },
};
