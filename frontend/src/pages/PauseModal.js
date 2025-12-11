import React from 'react';
import { FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import './PauseModal.css';

function PauseModal({ onResume, onQuit }) {
  const { isMusicMuted, toggleMusic } = useMusic();

  return (
    <div className="pause-modal-overlay">
      <div className="pause-modal">
        <h2 className="pause-modal-title"><FiPause className="pause-modal-icon" /> Game Paused</h2>
        <div className="pause-modal-content">
          <p className="pause-modal-text">
            Take a breather!
            Your timer is paused — resume when you're ready.
          </p>
          
          <div className="pause-modal-music-control">
            <button 
              className="pause-modal-music-button" 
              onClick={toggleMusic}
              title={isMusicMuted ? "Turn music on" : "Turn music off"}
            >
              {isMusicMuted ? (
                <>
                  <FiVolumeX className="music-icon" />
                  <span>Music Off</span>
                </>
              ) : (
                <>
                  <FiVolume2 className="music-icon" />
                  <span>Music On</span>
                </>
              )}
            </button>
          </div>
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
