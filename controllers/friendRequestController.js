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
    const receiverId = req.body.receiverId;

    try {
      const friendRequest = await FriendRequest.create({
        senderId: senderUser.id,
        receiverId: receiverId,
        date: Date.now(),
      });
      res.status(201).json({ friendRequest });

    } catch {
      res.status(400).json("Worng Request Data");
    }
  },
};
