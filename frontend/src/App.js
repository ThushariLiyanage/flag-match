import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import JoinCrew from './pages/JoinCrew';
import About from './pages/About';
import MusicToggle from './components/MusicToggle';
import { MusicProvider } from './context/MusicContext';
import { playClickSound } from './utils/clickSound';
import './App.css';

function App() {
  useEffect(() => {
    // Add global click sound for all buttons except flag cards
    const handleButtonClick = (e) => {

      if (e.target.closest('.game-card')) {
        return; // Skip click sound for flag cards
      }
      
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleButtonClick, true);
    return () => document.removeEventListener('click', handleButtonClick, true);
  }, []);

  return (
    <MusicProvider>
      <Router>
        <MusicToggle />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/join-crew" element={<JoinCrew />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Router>
    </MusicProvider>
  );
}

export default App;
