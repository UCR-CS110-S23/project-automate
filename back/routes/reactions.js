const express = require('express');
const router = express.Router();
const Message = require("../model/messages");

module.exports = router;

// Add like reaction to message
router.post('/like', async (req, res) => {
    console.log("reactions/like");
    try {
      const messageId = req.body.messageId;
      const userId = req.session.userId;
  
      // check for message
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      // Check if the user already reacted to the message
      const existingReaction = message.reactions.find(
        (reaction) => reaction.userId === userId
      );
      if (existingReaction && existingReaction.type === 'like') {
        return res.status(400).json({ error: 'User already liked the message' });
      }
  
      // Add like reaction to message
      message.reactions.push({ userId, type: 'like' });
      message.likes += 1; // Increment the like count
      await message.save();
  
      // Emit event to notify clients about the updated likes count
      io.to(message.room.toString()).emit('like', {
        messageId: messageId,
        likes: message.likes,
      });
  
      res.json({ message: 'Like reaction added' });
    } catch (error) {
      console.error('Error adding like reaction', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Add dislike reaction to message
  router.post('/dislike', async (req, res) => {
    console.log("reactions/DisLike");

    try {
      const messageId = req.body.messageId;
      const userId = req.session.userId;
  
      // Check for message
      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      // Check if the user already reacted to the message
      const existingReaction = message.reactions.find(
        (reaction) => reaction.userId === userId
      );
      if (existingReaction && existingReaction.type === 'dislike') {
        return res
          .status(400)
          .json({ error: 'User already disliked the message' });
      }
  
      // Add dislike reaction to message
      message.reactions.push({ userId, type: 'dislike' });
      message.likes -= 1; // Decrement the like count
      await message.save();
  
      // Emit event to notify clients about the updated likes count
      io.to(message.room.toString()).emit('dislike', {
        messageId: messageId,
        likes: message.likes,
      });
  
      res.json({ message: 'Dislike reaction added' });
    } catch (error) {
      console.error('Error adding dislike reaction', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
    
  
//reaction handlers