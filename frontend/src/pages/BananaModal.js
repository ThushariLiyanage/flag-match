import React from 'react';
import { FiClock, FiHelpCircle, FiCheck, FiX } from 'react-icons/fi';
import './BananaModal.css';

function BananaModal({ type, bonusTime, onPlay, onCancel }) {
  const isTimeout = type === 'timeout';

  return (
    <div className="banana-modal-overlay">
      <div className="banana-modal">
        <div className="banana-emoji">🍌</div>

        <h2 className="banana-modal-title">
          {isTimeout ? <><FiClock className="banana-modal-title-icon" /> Time's Up!</> : <><FiHelpCircle className="banana-modal-title-icon" /> Need a Second Chance?</>
          }
        </h2>

        <div className="banana-modal-content">
          {isTimeout ? (
            <>
              <p className="banana-modal-text">
                Looks like you ran out of time!
              </p>
              <p className="banana-modal-text">
                You can play a quick <strong>Banana Mini Game</strong> to earn <strong>+{bonusTime} seconds</strong> and continue playing.
              </p>
              <p className="banana-modal-text-small">
                Or end the game now and return to the mode menu.
              </p>
            </>
          ) : (
            <>
              <p className="banana-modal-text">
                You can play the <strong>Banana Mini Game</strong> now to earn more time.
              </p>
              <p className="banana-modal-text-highlight">
                Win: +{bonusTime} seconds <FiCheck className="banana-modal-icon" />
              </p>
              <p className="banana-modal-text-small">
                Lose: Game ends <span className="banana-emoji-small">😅</span>
              </p>
            </>
          )}
        </div>

        <div className="banana-modal-buttons">
          <button className="banana-modal-button primary" onClick={onPlay}>
            {isTimeout ? <><span className="banana-emoji-small">🍌</span> Play Banana Game</> : 'Play Now'}
          </button>
          <button className="banana-modal-button secondary" onClick={onCancel}>
            {isTimeout ? <><FiX className="banana-modal-icon" /> End Game</> : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BananaModal;
