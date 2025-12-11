import React from 'react';
import { FiGlobe } from 'react-icons/fi';
import { GiSwordman, GiQueenCrown } from 'react-icons/gi';
import './IntroModal.css';

function IntroModal({ difficulty, cardCount, hintsRemaining, onStart, onCancel }) {
  const titles = {
    easy: <><FiGlobe className="intro-title-icon" /> Welcome to Easy Mode!</>,
    medium: <><GiSwordman className="intro-title-icon" /> The challenge is rising!</>,
    hard: <><GiQueenCrown className="intro-title-icon" /> Only legends reach this far.</>
  };

  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal">
        <h2 className="intro-title">{titles[difficulty]}</h2>
        <div className="intro-content">
          <p className="intro-subtitle">Ready to test your memory?</p>
          <div className="intro-info">
            <p className="intro-text">
              Find the flags before time runs out.
              You'll get <strong>1 hints</strong>, but each hint costs <strong>25 points</strong>.
              If your time runs out, you can play the <strong>Banana Mini Game</strong> to earn extra time. <span className="banana-emoji-small">🍌</span>
            </p>
            <div className="intro-stats">
              <div className="intro-stat">
                <span className="intro-stat-label">Cards</span>
                <span className="intro-stat-value">{cardCount}</span>
              </div>
              <div className="intro-stat">
                <span className="intro-stat-label">Hints</span>
                <span className="intro-stat-value">{hintsRemaining}</span>
              </div>
            </div>
            <p className="intro-footer">Good luck — your journey starts now!</p>
          </div>
        </div>
        <div className="intro-buttons">
          <button className="intro-button primary" onClick={onStart}>
            Start Game
          </button>
          <button className="intro-button secondary" onClick={onCancel}>
            Back to Mode Select
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroModal;
