const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const postSchema = new Schema({
  user: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  content: { type: String },
  image: { type: String },
  date: { type: Date },
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
