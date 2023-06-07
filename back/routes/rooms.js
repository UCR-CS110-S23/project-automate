const express = require('express');
const router = express.Router()

module.exports = router;

const Room = require('../model/room'); 
const User = require('../model/user');

router.get('/all', async (req, res) => {
    // TODO: you have to check the database to only return the rooms that the user is in
    const username = req.session.username;
    const user = await User.findOne({ username });
    if (user) {
        const rooms = await Room.find({_id: {$in: user.rooms}});
        res.json(rooms);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

router.post('/create', async (req, res) => {
    // TODO: write necessary codes to create a new room
    const existingRoom = await Room.findOne({ name: req.body.name });
    if (existingRoom) {
        return res.status(400).json({ message: 'Room already exists' });
    }
    const newRoom = new Room({ name: req.body.name });
    const savedRoom = await newRoom.save();

    const username = req.session.username;
    const user = await User.findOne({ username });
    if (user) {
        user.rooms.push(savedRoom._id);
        await user.save();
    }
    
    res.json({ message: 'Room created' });
});


router.post('/join', async (req, res) => {
    // TODO: write necessary codes to join a new room
    const username = req.session.username;
    const roomName = req.body.roomName;

    const room = await Room.findOne({ name: roomName });
    const user = await User.findOne({ username });

    if (room && user && !user.rooms.includes(room._id)) {
        user.rooms.push(room._id);
        await user.save();
        res.json({ message: 'Joined room' });
    } else {
        res.status(400).json({ message: 'Room does not exist or user is already in the room' });
    }
});

router.delete('/leave', async (req, res) => {
    // TODO: write necessary codes to delete a room
    const username = req.session.username;
    const roomName = req.body.roomName;

    const room = await Room.findOne({ name: roomName });
    const user = await User.findOne({ username });

    if (room && user && user.rooms.includes(room._id)) {
        const index = user.rooms.indexOf(room._id);
        if (index != -1) {
            user.rooms.splice(index, 1);
        }
        await user.save();
        res.json({ message: 'Left room' });
    } else {
        res.status(400).json({ message: 'Room does not exist' });
    }
});
