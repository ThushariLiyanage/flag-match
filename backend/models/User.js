const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  crewName: {
    type: String,
    default: 'The Golden Compass'
  },
  rank: {
    type: String,
    default: 'Cadet'
  },
  totalScore: {
    type: Number,
    default: 0
  },
  achievements: {
    type: Number,
    default: 0
  },
  voyages: {
    type: Number,
    default: 0
  },
  completedLevels: {
    type: [String],
    default: [],
    enum: ['easy', 'medium', 'hard']
  }
});

module.exports = mongoose.model('User', UserSchema);
