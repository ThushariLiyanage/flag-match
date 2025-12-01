import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import './ResumeGameModal.css';

function ResumeGameModal({ difficulty, onContinue, onStartNew }) {
  const difficultyName = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Unknown';

  return (
    <div className="resume-modal-overlay">
      <div className="resume-modal">
        <h2 className="resume-modal-title"><FiRefreshCw className="resume-modal-icon" /> Continue Where You Left Off?</h2>
        <div className="resume-modal-content">
          <p className="resume-modal-text">
            We found your last game in <strong>{difficultyName} Mode</strong>.
            Would you like to continue from there or start fresh?
          </p>
        </div>
        <div className="resume-modal-buttons">
          <button className="resume-modal-button primary" onClick={onContinue}>
            Continue
          </button>
          <button className="resume-modal-button secondary" onClick={onStartNew}>
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeGameModal;
