const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Ensures backend .env is loaded regardless of process launch path
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import Routes
const authRoutes = require('./routes/auth');
const userApiRoutes = require('./routes/userApi');
const gameApiRoutes = require('./routes/gameApi');
const leaderboardApiRoutes = require('./routes/leaderboardApi');

// Test email service
const emailService = require('./utils/emailService');
console.log('[Server] Email service configured:', emailService.isEmailConfigured());

const app = express();
const PORT = 5002;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userApiRoutes);
app.use('/api/game', gameApiRoutes);
app.use('/api/leaderboard', leaderboardApiRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Flag-Match API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server] Unhandled error:', err);
  res.status(500).json({ error: err.message });
});

// Connect to MongoDB and start server
console.log('[Server] Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('[Server] MongoDB connected successfully.');
    console.log('[Server] Routes registered. About to listen on port:', PORT);
    // Start server after MongoDB connection
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] Server is running on 0.0.0.0:${PORT}`);
      console.log('[Server] Server listening successfully!');
    });
    server.on('error', (err) => {
      console.error('[Server] Listen error:', err.message);
    });
  })
  .catch(err => {
    console.error('[Server] MongoDB connection error:', err);
    process.exit(1);
  });

// Process error handlers
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled rejection at:', promise, 'reason:', reason);
});

// Keep-alive log
setInterval(() => {
  console.log('[Server] Still running...');
}, 10000);