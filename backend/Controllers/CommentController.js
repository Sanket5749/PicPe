const Comment = require("../models/Comment.js");
const Post = require("../models/Post.js");

const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.user.userId;
    if (!postId || !text) return res.status(400).json({ success: false, message: "Post and text required" });
    const comment = new Comment({ post: postId, user: userId, text });
    await comment.save();
    res.status(201).json({ success: true, message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate("user", "username").sort({ createdAt: 1 });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    if (comment.user.toString() !== userId) return res.status(403).json({ success: false, message: "Not authorized" });
    await comment.deleteOne();
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { addComment, getComments, deleteComment };
