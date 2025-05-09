const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/users/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during registration');
  }
});


// @route   POST /api/users/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid name or password' });

    user.password = undefined;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP || '1d',
    });

    return res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    }).status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during login');
  }
});


// @route   GET /api/users/logout
// @desc    Log out the user
// @access  Public
router.get('/logout', (req, res) => {
  return res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: new Date(0),
  }).status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @route   GET /api/users/all-users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/all-users', isAuthorized, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while fetching users');
  }
});

module.exports = router;
