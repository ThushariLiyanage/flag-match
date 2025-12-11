const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail, sendResetEmail, isEmailConfigured } = require('../utils/emailService');

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

// Register a new user and send OTP (if email configured)
router.post('/register', async (req, res) => {
  console.log('[Auth/register] ============ REQUEST RECEIVED ');
  console.log('[Auth/register] Body:', req.body);
  const { username, email, password } = req.body;
  console.log('[Auth/register] Request received:', { username, email });

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Username, email, and password are required' });
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User with this email or username already exists' });
    }

    console.log('[Auth/register] Creating new user...');
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
    console.log('[Auth/register] User saved:', user.id);

    // Generate and send OTP for verification
    const code = generateOTP();
    const otp = new OTP({
      email,
      code,
      purpose: 'login'
    });
    await otp.save();

    // Try to send OTP email
    try {
      console.log('[Auth] Calling sendOTPEmail for:', email);
      const emailResult = await sendOTPEmail(email, code);
      console.log('[Auth] Email result:', emailResult);
      
      if (emailResult.skipped || !emailResult.success) {
        // Email not configured or failed, fallback to instant login
        console.log('[Auth] Email skipped/failed, falling back to instant login');
        const token = await generateToken(user.id);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 90 * 24 * 60 * 60 * 1000
        });
        return res.json({
          success: true,
          msg: 'Account created successfully! Welcome to Flag Match.',
          user: { id: user.id, username: user.username, email: user.email }
        });
      }
      
      console.log('[Auth] Email sent, requiring OTP');
      console.log('[Auth] About to send response...');
      return res.json({
        success: true,
        msg: 'Account created! Verify your email with the code we sent.',
        requiresOTP: true,
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (emailErr) {
      console.warn('[Auth] Email sending error (caught):', emailErr.message);
      // If anything unexpected happens, still allow login
      const token = await generateToken(user.id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 90 * 24 * 60 * 60 * 1000
      });
      return res.json({
        success: true,
        msg: 'Account created successfully! Welcome to Flag Match.',
        user: { id: user.id, username: user.username, email: user.email }
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Handle user login using email and password, trigger OTP if enabled
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

    // Increment login count and decide if OTP is required
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // For the first 5 logins, skip OTP
    if (user.loginCount <= 5) {
      const token = await generateToken(user.id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 90 * 24 * 60 * 60 * 1000
      });
      return res.json({
        success: true,
        msg: 'Login successful!',
        user: { id: user.id, username: user.username, email: user.email }
      });
    }

    // Past 5 logins: require OTP
    await OTP.deleteMany({ email, purpose: 'login' });
    const code = generateOTP();
    const otp = new OTP({
      email,
      code,
      purpose: 'login'
    });
    await otp.save();

    // Try to send OTP email
    try {
      const emailResult = await sendOTPEmail(email, code);
      if (emailResult.skipped) {
        // Email not configured, fallback to instant login
        const token = await generateToken(user.id);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 90 * 24 * 60 * 60 * 1000
        });
        return res.json({
          success: true,
          msg: 'Login successful!',
          user: { id: user.id, username: user.username, email: user.email }
        });
      }
      
      res.json({
        success: true,
        msg: 'OTP sent to your email. Please verify to continue.',
        requiresOTP: true,
        user: { id: user.id, username: user.username, email: user.email }
      });
    } catch (emailErr) {
      console.warn('Email sending failed, proceeding without OTP:', emailErr);
      // If email fails, still allow login (fallback)
      const token = await generateToken(user.id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 90 * 24 * 60 * 60 * 1000
      });
      res.json({
        success: true,
        msg: 'Login successful!',
        user: { id: user.id, username: user.username, email: user.email }
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

//Verify OTP and return JWT token
router.post('/verify-otp', async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ msg: 'Email and OTP code are required' });
    }

    const otpRecord = await OTP.findOne({ email, code, purpose: 'login' });
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
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 90 * 24 * 60 * 60 * 1000
        });
        res.json({ user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({ success: true, msg: 'Logged out successfully' });
});

//Resend OTP to email
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

    await OTP.deleteMany({ email, purpose: 'login' });

    const code = generateOTP();
    const otp = new OTP({
      email,
      code,
      purpose: 'login'
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

//Send password reset code to email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await OTP.deleteMany({ email, purpose: 'reset' });

    const code = generateOTP();
    const otp = new OTP({ email, code, purpose: 'reset' });
    await otp.save();

    const emailResult = await sendResetEmail(email, code);

    return res.json({
      success: true,
      msg: emailResult.skipped ? 'Email not configured. Use the code shown.' : 'Reset code sent to your email.',
      skipped: emailResult.skipped || false,
      code: emailResult.skipped ? code : undefined
    });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

//Verify reset code and update password
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    if (!email || !code || !newPassword) {
      return res.status(400).json({ msg: 'Email, code, and new password are required' });
    }

    const otpRecord = await OTP.findOne({ email, code, purpose: 'reset' });
    if (!otpRecord) {
      return res.status(400).json({ msg: 'Invalid or expired code' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.loginCount = 0;
    await user.save();

    await OTP.deleteMany({ email, purpose: 'reset' });

    return res.json({ success: true, msg: 'Password updated. You can now sign in.' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
