const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/user/profile
// @desc    Get current user's profile (for Profile.js & Home.js stats)
router.get('/profile', auth, async (req, res) => {
  try {
    // req.user.id is attached by the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/user/profile
// @desc    Update user's profile (for Profile.js edit)
router.put('/profile', auth, async (req, res) => {
  const { username, email, crewName } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check for email/username conflict
    if (email && email !== user.email) {
      let existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ msg: 'Email already in use' });
      user.email = email;
    }
    if (username && username !== user.username) {
      let existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ msg: 'Username already in use' });
      user.username = username;
    }

    if (crewName) user.crewName = crewName;
    
    await user.save();
    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/user/score
// @desc    Update user's total score and voyage count after a game
router.post('/score', auth, async (req, res) => {
  const { finalScore } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update total score only if new score is higher
    if (finalScore > user.totalScore) {
      user.totalScore = finalScore;
    }
    
    // Increment number of voyages completed
    user.voyages = (user.voyages || 0) + 1;
    
    await user.save();
    res.json({ totalScore: user.totalScore, voyages: user.voyages });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;