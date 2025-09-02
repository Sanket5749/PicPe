const router = require("express").Router();
const {createPost} = require("../Controllers/PostController.js");
const {displayPost} = require("../Controllers/PostController.js");
const {deletePost} = require("../Controllers/PostController.js");
const {likePost} = require("../Controllers/PostController.js");
const {dislikePost} = require("../Controllers/PostController.js");

router.post("/create", createPost);
router.get("/display", displayPost);
router.delete("/:postId", deletePost);
router.patch("/:postId/like", likePost);
router.patch("/:postId/dislike", dislikePost);


module.exports = router;
