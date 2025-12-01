import React from 'react';
import { FiAward } from 'react-icons/fi';
import { MdCelebration } from 'react-icons/md';
import './LevelCompleteModal.css';

function LevelCompleteModal({ difficulty, score, isLastLevel, onContinue, onExit }) {
  const getContinueText = () => {
    if (difficulty === 'easy') return 'Continue to Medium Mode';
    if (difficulty === 'medium') return 'Continue to Hard Mode';
    return 'Play Again';
  };

  return (
    <div className="level-complete-overlay">
      <div className="level-complete-modal">
        <h2 className="level-complete-title"><MdCelebration className="level-complete-title-icon" /> Level Complete!</h2>
        <div className="level-complete-content">
          {isLastLevel ? (
            <>
              <p className="level-complete-text"><FiAward className="level-complete-text-icon" /> You did it!</p>
              <p className="level-complete-subtitle">You've completed all levels.</p>
              <p className="level-complete-footer">Well done, flag master!</p>
            </>
          ) : (
            <>
              <p className="level-complete-text">Great job, explorer!</p>
              <p className="level-complete-subtitle">
                You've mastered {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode.
              </p>
              <p className="level-complete-footer">Ready for a tougher challenge?</p>
            </>
          )}
          <div className="level-complete-score">
            <span className="level-complete-score-label">Final Score</span>
            <span className="level-complete-score-value">{score}</span>
          </div>
        </div>
        <div className="level-complete-buttons">
          <button className="level-complete-button primary" onClick={onContinue}>
            {getContinueText()}
          </button>
          <button className="level-complete-button secondary" onClick={onExit}>
            {isLastLevel ? 'Exit' : 'Back to Main Menu'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LevelCompleteModal;
