const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  date: { type: Date },
});

const FriendRequest = mongoose.model("friendRequest", friendRequestSchema);

module.exports = FriendRequest;
