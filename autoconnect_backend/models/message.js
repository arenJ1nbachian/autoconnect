const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  convoID: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Conversations",
  },
  senderID: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  content: { type: String, required: true },
});

module.exports = mongoose.model("Messages", messageSchema);
