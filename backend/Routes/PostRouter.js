const router = require("express").Router();
const {createPost} = require("../Controllers/PostController.js");
const {displayPost} = require("../Controllers/PostController.js");
const {deletePost} = require("../Controllers/PostController.js");
const {likePost} = require("../Controllers/PostController.js");
const {dislikePost} = require("../Controllers/PostController.js");
const authenticateToken = require("../middleware/Middleware.js");

router.post("/create", createPost);
router.get("/display", displayPost);
router.delete("/:postId", authenticateToken, deletePost);
router.patch("/:postId/like", authenticateToken, likePost);
router.patch("/:postId/dislike", authenticateToken, dislikePost);


module.exports = router;