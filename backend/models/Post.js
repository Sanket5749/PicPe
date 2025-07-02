const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User.js");

const postSchema = new Schema({
  caption: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]

});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
