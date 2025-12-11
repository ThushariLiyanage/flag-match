import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-shell">
      <div className="landing-background">
        <div className="landing-overlay"></div>
        <div className="landing-grid landing-grid-1"></div>
        <div className="landing-grid landing-grid-2"></div>
      </div>

      <div className="landing-content">
        <h1 className="landing-title">Flag Match</h1>
        <p className="landing-tagline">Quick-fire world flags challenge for daring captains.</p>

        <button className="landing-play-btn" onClick={() => navigate('/login')}>
          Play
        </button>

        <div className="landing-hints">Tap Play to head to login and start the voyage.</div>
      </div>
    </div>
  );
}

export default Landing;
