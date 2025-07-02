const router = require("express").Router();
const authenticateToken = require("../middleware/Middleware.js");
const {
  signup,
  login,
  displayUser,
  getMe,
  getUserById,
  followUser,
  unfollowUser,
} = require("../Controllers/AuthController.js");
const jwt = require("jsonwebtoken");



router.post("/login", login);
router.post("/signup", signup);
router.get("/display", displayUser);
router.get("/me", authenticateToken, getMe);
router.get("/:id", getUserById);
router.post("/:id/follow", authenticateToken, followUser);
router.post("/:id/unfollow", authenticateToken, unfollowUser);


module.exports = router;
