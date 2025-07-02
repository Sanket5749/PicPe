const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User.js");

const storySchema = new Schema({
  media: {
    type: String,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
