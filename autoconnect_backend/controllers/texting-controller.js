const Conversations = require("../models/conversation");
const Messages = require("../models/message");
const Users = require("../models/user");

const getMessage = async (req, res, next) => {
  const { mid } = req.params;
  console.log(mid);
  try {
    const messageFound = await Messages.findById(mid);

    if (!messageFound) {
      res.status(404).json({ message: "No message found" });
    } else {
      res.status(200).json({ message: messageFound });
    }
  } catch (err) {
    console.error("Error fetching message:", err);
  }
};

const getConversations = async (req, res, next) => {
  const { uid } = req.params;

  try {
    const conversationsFound = await Conversations.find({
      participants: { $in: [uid] },
    });

    if (conversationsFound.length > 0) {
      res.status(200).json({ conversations: conversationsFound });
    } else {
      res.status(404).json({ message: "No conversations yet!" });
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

const getConversation = async (req, res, next) => {};

const createConversation = async (req, res, next) => {
  const { clientId, sellerId, message, listingId } = req.body;

  try {
    const convoFound = await Conversations.findOne({
      participants: { $all: [clientId, sellerId] },
    });

    if (convoFound) {
      const newMessage = new Messages({
        convoID: convoFound._id,
        senderID: clientId,
        content: message,
      });
      convoFound.lastMessage = newMessage._id;
      convoFound.messages.push(newMessage._id);

      await convoFound.save();
      await newMessage.save();

      res
        .status(200)
        .json({ message: "Conversation exists, update successfull" });
    } else {
      const newMessage = new Messages({
        convoID: null,
        senderID: clientId,
        content: message,
      });

      await newMessage.save({ validateBeforeSave: false });

      const newConvo = new Conversations({
        participants: [clientId, sellerId],
        lastMessage: newMessage._id,
        messages: [newMessage._id],
        listingId: listingId,
      });

      await newConvo.save();

      newMessage.convoID = newConvo._id;
      await newMessage.save();

      await Users.findByIdAndUpdate(clientId, {
        $push: { usersInteracted: sellerId },
      });
      await Users.findByIdAndUpdate(sellerId, {
        $push: { usersInteracted: clientId },
      });

      res.status(200).json({
        message: "Conversation does not exists, creation successfull",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getMessage = getMessage;
exports.getConversations = getConversations;
exports.getConversation = getConversation;
exports.createConversation = createConversation;
