const User = require("../models/User.js");
const Post = require("../models/Post.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully", username });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_TOKEN,
      { expiresIn: "24h" }
    );
    res
      .status(200)
      .json({ success: true, message: "Login successful", token, username });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const displayUser = async (req, res) => {
  try {
    const allUser = await User.find({});
    res.status(200).json({ success: true, users: allUser });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const getMe = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const posts = await Post.find({ owner: userId });
    res.status(200).json({ success: true, user, posts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    const posts = await Post.find({ owner: req.params.id });
    res.status(200).json({ success: true, user, posts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const followUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const targetId = req.params.id;
    if (userId === targetId)
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });
    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!user || !target)
      return res.status(404).json({ success: false, message: "User not found" });
    if (user.following.includes(targetId))
      return res
        .status(400)
        .json({ success: false, message: "Already following" });
    user.following.push(targetId);
    target.followers.push(userId);
    await user.save();
    await target.save();
    res.status(200).json({ success: true, message: "Followed user" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const targetId = req.params.id;
    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!user || !target)
      return res.status(404).json({ success: false, message: "User not found" });
    user.following = user.following.filter((f) => f.toString() !== targetId);
    target.followers = target.followers.filter((f) => f.toString() !== userId);
    await user.save();
    await target.save();
    res.status(200).json({ success: true, message: "Unfollowed user" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


module.exports = {
  signup,
  login,
  displayUser,
  getMe,
  getUserById,
  followUser,
  unfollowUser
};
