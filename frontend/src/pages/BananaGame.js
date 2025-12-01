import React, { useState, useEffect } from 'react';
import './BananaGame.css';

const BananaGame = ({ onComplete, onClose }) => {
  const [questImage, setQuestImage] = useState(null);
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the puzzle from the API
  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const response = await fetch('https://marcconrad.com/uob/banana/api.php');
        const data = await response.json();
        setQuestImage(data.question);
        setSolution(data.solution);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching banana game:", error);
        setMessage("Failed to load quest.");
        setLoading(false);
      }
    };

    fetchQuest();
  }, []);

  const handleSubmit = () => {
    const parsedAnswer = parseInt(userAnswer);
    
    if (parsedAnswer === solution) {
      setMessage('Correct! Adding +30 seconds...');
      setTimeout(() => {
        onComplete(true);
      }, 1500);
    } else {
      setMessage('Incorrect! Game Over.');
      setTimeout(() => {
        onComplete(false);
      }, 1500);
    }
  };

  return (
    <div className="banana-game-overlay">
      <div className="banana-game-container">
        {loading ? (
          <div className="banana-loading-screen">
            <div className="banana-loading-content">
              <div className="banana-spinner">
                <div className="spinner-ring"></div>
              </div>
              <h2 className="loading-title">The Banana Game</h2>
              <p className="loading-subtitle">Fetching your puzzle...</p>
              <div className="loading-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h2 className="game-title">The Banana Game</h2>
            <p className="game-subtitle">Solve the puzzle to revive your timer!</p>

            {questImage && (
              <img
                src={questImage}
                alt="Math Puzzle"
                className="banana-quest-image"
              />
            )}

            <div className="banana-input-section">
              <h3 className="input-label">Enter the missing digit:</h3>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="?"
                className="banana-input"
              />
              <div className={`message-display ${message.includes('Correct') ? 'success' : message ? 'error' : ''}`}>
                {message}
              </div>

              <div className="banana-buttons">
                <button className="banana-submit-btn" onClick={handleSubmit}>Submit Answer</button>
                <button className="banana-cancel-btn" onClick={onClose}>Give Up</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BananaGame;
