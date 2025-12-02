const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GameState = require('../models/GameState');
const User = require('../models/User');

// @route   GET /api/game/load
// @desc    Load saved game state for user (replaces loadGameState())

router.get('/', auth, async (req, res) => {
  try {
    // 1. Fetch top 10 users sorted by totalScore (descending)
    const topUsers = await User.find()
      .sort({ totalScore: -1 })
      .limit(10)
      .select('-password'); // Exclude password for security

    // 2. Transform data to match Frontend structure
    const leaderboardData = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.username,
      country: null,
      points: user.totalScore,
      icon: index === 0 ? 'crown' : index === 1 ? 'star' : index === 2 ? 'globe' : null,
      isCurrentUser: req.user ? user._id.toString() === req.user.id : false
    }));

    res.json(leaderboardData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/load', auth, async (req, res) => {
  try {
    const state = await GameState.findOne({ user: req.user.id });
    if (!state) {
      return res.status(404).json(null); // Send null if no save state exists
    }
    res.json(state);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/game/save
// @desc    Save or update game state (replaces saveGameState())
router.post('/save', auth, async (req, res) => {
  const { difficulty, currentLevel, score, currentQuestionIndex, timeRemaining, hintsRemaining, cards, flagsToFind } = req.body;
  
  const gameStateFields = {
    user: req.user.id,
    difficulty,
    currentLevel,
    score,
    currentQuestionIndex,
    timeRemaining,
    hintsRemaining,
    cards,
    flagsToFind,
    lastUpdated: Date.now()
  };

  try {
    // Use findOneAndUpdate with upsert:true to create a new state or update existing one
    let state = await GameState.findOneAndUpdate(
      { user: req.user.id },
      { $set: gameStateFields },
      { new: true, upsert: true }
    );
    res.json(state);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/game/clear
// @desc    Clear saved game state (replaces clearGameState())
router.delete('/clear', auth, async (req, res) => {
  try {
    await GameState.findOneAndDelete({ user: req.user.id });
    res.json({ msg: 'Game state cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;