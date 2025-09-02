const router = require("express").Router();
const { sendMessage, getMessages, deleteMessage } = require("../Controllers/MessageController.js");

router.post("/send", sendMessage);
router.get("/with/:otherId", getMessages);
router.delete("/:messageId", deleteMessage);

module.exports = router;
