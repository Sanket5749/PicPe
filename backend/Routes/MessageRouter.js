const router = require("express").Router();
const { sendMessage, getMessages, deleteMessage } = require("../Controllers/MessageController.js");
const authenticateToken = require("../middleware/Middleware.js");

router.post("/send", authenticateToken, sendMessage);
router.get("/with/:otherId", authenticateToken, getMessages);
router.delete("/:messageId", authenticateToken, deleteMessage);

module.exports = router;
