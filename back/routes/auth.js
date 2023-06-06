const express = require('express');
const User = require('../model/user');
const router = express.Router()

module.exports = router;

router.post('/login', async (req, res) => {
    const {session} = req;
    const { username, password } = req.body;

    // check if user in database
    const user = await User.findOne({ username });
    
    if (!user)
      return res.json({ msg: "Incorrect Username ", status: false });
    else if (user.password !== password){
      return res.json({ msg: "Incorrect Password", status: false });
    }
    else {
      session.authenticated = true;
      session.username = username;
      res.json({ msg: "Logged in", status: true });
      
      console.log(username);
      console.log(session.authenticated);
    }
});

router.post('/register', async (req, res) => {
  const { username, password, name } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ msg: 'Username already exists', status: false });
    }
    
    // Create new user
    const newUser = new User({ username, password, name });
    await newUser.save();

    // Registration successful
    res.json({ msg: 'User registered successfully', status: true });
  } catch (error) {
    // Handle errors
    console.error('Error registering user:', error);
    res.status(500).json({ msg: 'Error during registration', status: false });
  }
});

// Set up a route for the logout page
router.get('/logout', (req, res) => {
    // Clear the session data and redirect to the home page
    req.session.destroy();
    res.send({msg: "Logged out", status: true})
  });