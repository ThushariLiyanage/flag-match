const mongoose = require('mongoose');

const GameStateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user has only one saved game
  },
  difficulty: String,
  currentLevel: Number,
  score: Number,
  currentQuestionIndex: Number,
  timeRemaining: Number,
  hintsRemaining: Number,
  cards: [Object],
  flagsToFind: [Object],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GameState', GameStateSchema);