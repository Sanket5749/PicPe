const router = require("express").Router();
const {createStory} = require("../Controllers/StoryController.js");
const {displayStory} = require("../Controllers/StoryController.js");
const {viewStories} = require("../Controllers/StoryController.js");
const authenticateToken = require("../middleware/Middleware.js");

router.post("/create", createStory);
router.get("/display", displayStory);

module.exports = router;
