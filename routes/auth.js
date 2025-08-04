const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'User already exists. Try Logging in' });

  const hash = await bcrypt.hash(password, 10);// Hash the password salt value is 10 so we are applying 10 rounds of hashing
  const user = new User({ name, email, password: hash });
  await user.save();
  res.json({ msg: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Registration failed' });
  }
});


// Login
router.post('/login', async (req, res) => {
  try{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'No User Exists With This Email' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: 'Wrong password ' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });}
  catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Login failed' });
  }
});

router.get("/test", (req, res) => {
  res.send("Auth route working!");
});

module.exports = router;
