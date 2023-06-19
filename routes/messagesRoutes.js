const {
  addMessage,
  getAllMessages,
} = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/get-all-messages", getAllMessages);
router.post("/add-message", addMessage);

module.exports = router;
