const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const userApiRoutes = require('./routes/userApi');
const gameApiRoutes = require('./routes/gameApi');
const leaderboardApiRoutes = require('./routes/leaderboardApi');

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userApiRoutes);
app.use('/api/game', gameApiRoutes);
app.use('/api/leaderboard', leaderboardApiRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Flag-Match API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});