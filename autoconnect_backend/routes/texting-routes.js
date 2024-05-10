const express = require("express");

const textingController = require("../controllers/texting-controller");
const router = express.Router();

router.get("/messages/:mid", textingController.getMessage);

router.get("/:uid", textingController.getConversations);

router.get("/:cid", textingController.getConversation);

router.post("/createConvo", textingController.createConversation);

module.exports = router;
