const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  lastMessage: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "Messages",
  },
  messages: [
    {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Messages",
    },
  ],
  listingId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Listings",
  },
});

module.exports = mongoose.model("Conversations", conversationSchema);
