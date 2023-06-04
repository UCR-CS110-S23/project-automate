const express = require('express');
const router = express.Router()
// TODO: add rest of the necassary imports


module.exports = router;

// temporary rooms
rooms = ["room1", "room2", "room3"]

//Get all the rooms
router.get('/all', (req, res) => {
    // TODO: you have to check the database to only return the rooms that the user is in
    res.send(rooms)

});

// create room
router.post('/create', (req, res) => {
    // TODO: write necassary codesn to Create a new room
    const {roomName} = req.body;
    rooms.push(roomName);
    res.send({message: 'Room created', roomName});
});

// join room
router.post('/join', (req, res) => {
    // TODO: write necassary codes to join a new room
    const {roomName} = req.body;


});

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