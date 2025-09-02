const router = require("express").Router();
const { addComment, getComments, deleteComment } = require("../Controllers/CommentController.js");
const authenticateToken = require("../middleware/Middleware.js");

router.post("/add", authenticateToken, addComment);
router.get("/post/:postId", getComments);
router.delete("/:commentId", authenticateToken, deleteComment);

module.exports = router;
