const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail, isEmailConfigured } = require('../utils/emailService');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = { user: { id: userId } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '90d' },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

// @route   POST /auth/register
// @desc    Register a new user and send OTP (if email configured)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Username, email, and password are required' });
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User with this email or username already exists' });
    }

    user = new User({
      username,
      email,
      password,
      crewName: 'The Golden Compass',
      rank: 'Cadet'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const token = await generateToken(user.id);
    res.json({
      token,
      success: true,
      msg: 'Account created successfully! Welcome to Flag Match.',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   POST /auth/login
// @desc    Authenticate user with email & password, send OTP if configured
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = await generateToken(user.id);
    res.json({
      token,
      success: true,
      msg: 'Login successful!',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /auth/verify-otp
// @desc    Verify OTP and return JWT token
router.post('/verify-otp', async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ msg: 'Email and OTP code are required' });
    }

    const otpRecord = await OTP.findOne({ email, code });
    if (!otpRecord) {
      return res.status(400).json({ msg: 'Invalid OTP code' });
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ msg: 'Too many failed attempts. Please try logging in again.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '90d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /auth/resend-otp
// @desc    Resend OTP to email
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    await OTP.deleteMany({ email });

    const code = generateOTP();
    const otp = new OTP({
      email,
      code
    });
    await otp.save();

    await sendOTPEmail(email, code);

    res.json({
      success: true,
      msg: 'OTP resent to your email'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
