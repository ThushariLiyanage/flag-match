const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  code: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['login', 'reset'],
    default: 'login',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300
  },
  attempts: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('OTP', OTPSchema);
