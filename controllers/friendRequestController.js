const FriendRequest = require("../models/FriendRequest");
const jwt = require("jsonwebtoken");
const { userData } = require("../middleware/authMiddleware");
const User = require("../models/User");

require("dotenv").config();

module.exports = {
  async index(req, res) {
    const User = await userData(req, res);
    const userId = User.id;
    try {
      const friendRequests = await FriendRequest.find({
        receiverId: userId,
      }).exec();
      res.status(200).json(friendRequests);
    } catch (err) {
      res.status(400).json("The is no friend request");
    }
  },
  async create(req, res) {
    const senderUser = await userData(req, res);
    if (senderUser?.id) {
      const receiverId = req.body.receiverId;
      try {
        const user = await User.findById(receiverId).exec();
        if (user) {
          const friendRequestExist = await FriendRequest.findOne({
            senderId: senderUser.id,
            receiverId: receiverId,
          });
          if (friendRequestExist == null) {
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
          } else {
            res.status(400).json("Friend Request is alrady send");
          }
        }
      } catch (error) {
        res.status(400).json("The receiver ID is worng");
      }
    }
  },
};
