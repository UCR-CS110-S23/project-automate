const express = require('express');
const router = express.Router()
// TODO: add rest of the necassary imports
const Room = require('../model/room');
const User = require('../model/user');

module.exports = router;

// temporary rooms
rooms = ["room1", "room2", "room3"]

//Get all the rooms
router.get('/all', async (req, res) => {
    // TODO: you have to check the database to only return the rooms that the user is in
    try {
        const { username } = req.session;
        // Find user in db by username
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        // Find rooms that user is in.
        const rooms = user.rooms;
        res.json(rooms);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }

});

// create room
router.post('/create', async (req, res) => {
    // TODO: write necassary code to Create a new room
    try{
        const {roomName} = req.body;
        const newRoom = new Room({ name: roomName });
        await newRoom.save();
        res.send({ message: 'Room created', roomName });
    } 
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// join room
router.post('/join', (req, res) => {
    // TODO: write necassary codes to join a new room


});

// delete room
router.delete('/leave', (req, res) => {
    // TODO: write necassary codes to delete a room
    const { roomName } = req.body;
    const index = rooms.indexOf(roomName);
    
    if (index !== -1) {
        rooms.splice(index, 1);
        res.send({ message: 'Left room successfully', roomName });
    }
    else {
        res.status(404).send({ message: 'Room does not exist' });
    }
});