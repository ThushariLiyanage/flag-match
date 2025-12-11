import React from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import './MusicToggle.css';

function MusicToggle() {
  const { isSoundMuted, toggleSound } = useMusic();

  return (
    <button
      className="music-toggle-btn"
      onClick={toggleSound}
      title={isSoundMuted ? 'Unmute all sounds' : 'Mute all sounds'}
      aria-label="Toggle all sounds"
    >
      {isSoundMuted ? (
        <FiVolumeX className="music-toggle-icon" />
      ) : (
        <FiVolume2 className="music-toggle-icon" />
      )}
    </button>
  );
}

export default MusicToggle;
