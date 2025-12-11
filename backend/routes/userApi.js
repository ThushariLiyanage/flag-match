const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

//Get current user's profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Update user's profile
router.put('/profile', auth, async (req, res) => {
  const { username, email, crewName } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    
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

// Update user's total score and voyage count after a game

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

// Get user's completed levels and unlocked status
router.get('/progression', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const completedLevels = user.completedLevels || [];
    const unlockedLevels = ['easy'];

    if (completedLevels.includes('easy')) {
      unlockedLevels.push('medium');
    }
    if (completedLevels.includes('medium')) {
      unlockedLevels.push('hard');
    }

    res.json({
      completedLevels,
      unlockedLevels
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//Mark a level as completed and unlock the next one
router.post('/complete-level', auth, async (req, res) => {
  const { difficulty } = req.body;

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ msg: 'Invalid difficulty level' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Add level to completed list if not already there
    if (!user.completedLevels.includes(difficulty)) {
      user.completedLevels.push(difficulty);
      await user.save();
    }

    // Calculate unlocked levels
    const unlockedLevels = ['easy'];
    if (user.completedLevels.includes('easy')) {
      unlockedLevels.push('medium');
    }
    if (user.completedLevels.includes('medium')) {
      unlockedLevels.push('hard');
    }

    res.json({
      completedLevels: user.completedLevels,
      unlockedLevels
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
