const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  name: String,
  avatar: String,
  likes: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      name: String,
      avatar: String,
      date: { type: Date, default: Date.now() },
    },
  ],
  date: { type: Date, default: Date.now() },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
