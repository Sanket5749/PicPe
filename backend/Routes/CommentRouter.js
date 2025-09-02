const router = require("express").Router();
const { addComment, getComments, deleteComment } = require("../Controllers/CommentController.js");

router.post("/add", addComment);
router.get("/post/:postId", getComments);
router.delete("/:commentId", deleteComment);

module.exports = router;
