import React from 'react';
import { FiPause } from 'react-icons/fi';
import './PauseModal.css';

function PauseModal({ onResume, onQuit }) {
  return (
    <div className="pause-modal-overlay">
      <div className="pause-modal">
        <h2 className="pause-modal-title"><FiPause className="pause-modal-icon" /> Game Paused</h2>
        <div className="pause-modal-content">
          <p className="pause-modal-text">
            Take a breather!
            Your timer is paused — resume when you're ready.
          </p>
        </div>
        <div className="pause-modal-buttons">
          <button className="pause-modal-button primary" onClick={onResume}>
            Resume
          </button>
          <button className="pause-modal-button secondary" onClick={onQuit}>
            Quit to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default PauseModal;
