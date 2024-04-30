const express = require("express");

const textingController = require("../controllers/texting-controller");
const router = express.Router();

router.post("/:cid/messages", textingController.sendMessage);

router.get("/:uid", textingController.getConversations);

router.get("/:cid", textingController.getConversation);

module.exports = router;
