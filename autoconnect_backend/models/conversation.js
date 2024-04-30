const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Conversations", userSchema);
