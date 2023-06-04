
const express = require("express");
const socketIO = require('socket.io');
const http = require('http');
const cors  = require("cors");
const session = require('express-session');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require( 'body-parser');

const app = express(); 
const server = http.createServer(app);
const io = socketIO(server);

const routes = require('./routes/auth');
const rooms = require('./routes/rooms');


// TODO: add cors to allow cross origin requests
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Connect to the database
// TODO: your code here
mongoose.connect(process.env.mongodb);
const database = mongoose.connection;

database.on('error', (error) => console.error(error));
database.once('connected', ()=>{
  console.log("Connected to the DB!");
})


// Set up the session
// TODO: your code here
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}))


app.get('/', (req, res) => {
  if (req.session && req.session.authenticated) {
    res.json({ message: "logged in" });
  }
  else {  
    console.log("not logged in")
    res.json({ message: "not logged" });
  }
});


app.use("/api/auth/", routes);


// check session before access to rooms
app.use((req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});
app.use("/api/rooms/", rooms);

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});


// TODO: make sure that the user is logged in before connecting to the socket
// TODO: your code here
io.use((socket, next) => {
  // Access socket session
  const session = socket.request.session;

  if (session && session.authenticated) {
    // user logged in and authenticated
    next();
  } else {
    // User not logged in
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  console.log('user connected');
  // Handle events for logged in user
  socket.on('chatMessage', (message) => {
    // If user is logged in handle chat events
    if (socket.request.session && socket.request.session.authenticated) { 
      console.log(`Message received from authenticated user: ${message}`);

      // Broadcast to additional connected clients
      socket.broadcast.emit('chatMessage', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})

/*
io.on('connection', (socket)=>{
    console.log("user connected")
    // TODO: write codes for the messaging functionality
    // TODO: your code here
})
*/


