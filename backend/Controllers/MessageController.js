const Message = require("../models/Message.js");
const User = require("../models/User.js");


const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.userId;
    if (!receiverId || !text) return res.status(400).json({ success: false, message: "Receiver and text required" });
    const message = new Message({ sender: senderId, receiver: receiverId, text });
    await message.save();
    res.status(201).json({ success: true, message: "Message sent", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otherId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    if (message.sender.toString() !== userId) return res.status(403).json({ success: false, message: "Not authorized" });
    await message.deleteOne();
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { sendMessage, getMessages, deleteMessage };
