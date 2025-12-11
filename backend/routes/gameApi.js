const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GameState = require('../models/GameState');


// Load saved game state for user
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


//Save or update game state for user
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
    //create a new state or update existing one
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


//Clear saved game state for user
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