const Post = require("../models/Post.js");

const createPost = async (req, res) => {
  try {
    const { caption, media, userId } = req.body;
    const newPost = new Post({ caption, media, owner: userId });
    await newPost.save();
    res
      .status(201)
      .json({ success: true, message: "Post created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const displayPost = async (req, res) => {
  try {
    const allPost = await Post.find({}).populate("owner", "username email");
    res.status(200).json({ success: true, posts: allPost });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const deletePost = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.owner.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Post.deleteOne({ _id: postId });
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
const likePost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "Already liked" });
    }
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
    post.likes.push(userId);
    await post.save();

    res.status(200).json({ liked: true, dislikes: post.dislikes.length, likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const dislikePost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.dislikes.includes(userId)) {
      return res.status(400).json({ message: "Already disliked" });
    }

    post.likes = post.likes.filter(id => id.toString() !== userId);
    post.dislikes.push(userId);
    await post.save();

    res.status(200).json({ disliked: true, dislikes: post.dislikes.length, likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  displayPost,
  deletePost,
  dislikePost,
  likePost
};