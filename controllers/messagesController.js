const messageModel = require("../model/messageModel");
const { response } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    console.log(from, to, message);

    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    console.log(data);

    if (data) {
      return res.json({ msg: "Message Added Successfully." });
    } else {
      return res.json({ msg: "Failed to Added Message to the DB." });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projectMessages = messages.map((message) => {
      return {
        fromSelf: message.sender.toString() === from,
        message: message.message.text,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
