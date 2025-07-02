const User = require("../models/User");
const Story = require("../models/Story.js");

const createStory = async (req, res) => {
  try {
    const { media, userId } = req.body;
    const newStory = new Story({ media, owner: userId });
    await newStory.save();
    res
      .status(201)
      .json({ success: true, message: "Story created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const displayStory = async (req, res) => {
  try {
    const allStory = await Story.find({}).populate("owner", "username email");
    res.status(200).json({ success: true, storys: allStory });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createStory,
  displayStory
};
