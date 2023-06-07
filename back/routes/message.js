const express = require('express');
const router = express.Router()

module.exports = router;

const Message = require("../model/messages");
const Room = require("../model/room")

router.get('/:room', async (req, res) => {
    const {room} = req.params;
    const UserRoom = await Room.findOne({name: room})
    const messages = await Message.find({room: UserRoom});
    const messageTexts = messages.map(message => message.message.text);
    res.json(messageTexts);
  });