const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
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

const Friend = mongoose.model("friend", friendSchema);

module.exports = Friend;
