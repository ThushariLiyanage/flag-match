import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BananaGame from './BananaGame';
import IntroModal from './IntroModal';
import BananaModal from './BananaModal';
import LevelCompleteModal from './LevelCompleteModal';
import PauseModal from './PauseModal';
import ResumeGameModal from './ResumeGameModal';
import TimerDisplay from './TimerDisplay';
import { getTimeBonus } from './bananaApi';
import api from '../api';
import './Game.css';

const COUNTRIES = [
  { name: 'France', flag: 'https://flagcdn.com/w320/fr.png' },
  { name: 'Germany', flag: 'https://flagcdn.com/w320/de.png' },
  { name: 'Italy', flag: 'https://flagcdn.com/w320/it.png' },
  { name: 'Spain', flag: 'https://flagcdn.com/w320/es.png' },
  { name: 'Japan', flag: 'https://flagcdn.com/w320/jp.png' },
  { name: 'Brazil', flag: 'https://flagcdn.com/w320/br.png' },
  { name: 'Canada', flag: 'https://flagcdn.com/w320/ca.png' },
  { name: 'Mexico', flag: 'https://flagcdn.com/w320/mx.png' },
  { name: 'United Kingdom', flag: 'https://flagcdn.com/w320/gb.png' },
  { name: 'China', flag: 'https://flagcdn.com/w320/cn.png' },
  { name: 'Netherlands', flag: 'https://flagcdn.com/w320/nl.png' },
  { name: 'Australia', flag: 'https://flagcdn.com/w320/au.png' },
  { name: 'India', flag: 'https://flagcdn.com/w320/in.png' },
  { name: 'Russia', flag: 'https://flagcdn.com/w320/ru.png' },
  { name: 'South Korea', flag: 'https://flagcdn.com/w320/kr.png' },
  { name: 'Turkey', flag: 'https://flagcdn.com/w320/tr.png' },
  { name: 'Egypt', flag: 'https://flagcdn.com/w320/eg.png' },
  { name: 'South Africa', flag: 'https://flagcdn.com/w320/za.png' },
  { name: 'Argentina', flag: 'https://flagcdn.com/w320/ar.png' },
  { name: 'Thailand', flag: 'https://flagcdn.com/w320/th.png' },
  { name: 'Sweden', flag: 'https://flagcdn.com/w320/se.png' },
  { name: 'Poland', flag: 'https://flagcdn.com/w320/pl.png' },
  { name: 'Greece', flag: 'https://flagcdn.com/w320/gr.png' },
  { name: 'Portugal', flag: 'https://flagcdn.com/w320/pt.png' }
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getGridSize(cardCount) {
  if (cardCount === 4) return { rows: 1, cols: 4 };
  if (cardCount === 8) return { rows: 2, cols: 4 };
  return { rows: 3, cols: 4 };
}

const LEVEL_CONFIGS = {
  easy: { cardCount: 4, questionsPerLevel: 2, timePerQuestion: 10 },
  medium: { cardCount: 8, questionsPerLevel: 2, timePerQuestion: 10 },
  hard: { cardCount: 12, questionsPerLevel: 2, timePerQuestion: 10 }
};

const TIMER_CONFIG = {
  easy: 8,
  medium: 12,
  hard: 15,
  bonusTime: {
    easy: 10,
    medium: 10,
    hard: 10
  }
};

function clearGameState() {
  localStorage.removeItem('flagGameSave');
}

function Game() {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showBananaGame, setShowBananaGame] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flagsToFind, setFlagsToFind] = useState([]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levelScore, setLevelScore] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [, setFeedback] = useState(null);

  const [hints, setHints] = useState(2);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showBananaModal, setShowBananaModal] = useState(false);
  const [bananaModalType, setBananaModalType] = useState('timeout');
  const [bananaBonus, setBananaBonus] = useState(0);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [savedGameState, setSavedGameState] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasRevived, setHasRevived] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState(['easy']);

  const allCardsRef = useRef([]);
  const timerRef = useRef(null);

  const levels = ['easy', 'medium', 'hard'];
  const cardCount = LEVEL_CONFIGS[difficulty]?.cardCount || 0;
  const gridSize = useMemo(() => getGridSize(cardCount), [cardCount]);

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resumeTimer = () => {
    if (timeRemaining <= 0) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Timer expired - trigger timeout handler
          // pauseTimer();
          // setBananaModalType('timeout');
          // const bonus = getTimeBonus(difficulty);
          // setBananaBonus(bonus);
          // setShowBananaModal(true);
          handleTimeout(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const fetchProgression = async () => {
      try {
        const { data } = await api.get('/user/progression');
        setUnlockedLevels(data.unlockedLevels);
      } catch (err) {
        console.error('Failed to fetch progression:', err);
        setUnlockedLevels(['easy']);
      }
    };
    fetchProgression();
  }, []);

  useEffect(() => {
    if (!difficulty) {
      const checkForSavedGame = async () => {
        try {
          const { data } = await api.get('/game/load');
          if (data) {
            setSavedGameState(data);
            setShowResumeModal(true);
          }
        } catch {
          console.log('No saved game found.');
        }
      };
      checkForSavedGame();
    }
  }, [difficulty]);

  useEffect(() => {
    const anyModalOpen = showIntroModal || showBananaModal || showLevelComplete || showPauseModal || showResumeModal || showBananaGame;
    if (anyModalOpen) {
      pauseTimer();
    } else if (!isPaused && timeRemaining > 0 && difficulty) {
      // Resume timer when modals close
      pauseTimer();
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            pauseTimer();
            setBananaModalType('timeout');
            const bonus = getTimeBonus(difficulty);
            setBananaBonus(bonus);
            setShowBananaModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [showIntroModal, showBananaModal, showLevelComplete, showPauseModal, showResumeModal, showBananaGame, isPaused, timeRemaining, difficulty]);

  const handleDifficultySelect = (level) => {
    if (!unlockedLevels.includes(level)) {
      return;
    }

    setDifficulty(level);
    setCurrentLevel(0);
    setScore(0);
    setHints(2);
    setHasRevived(false)

    const allCountries = shuffle(COUNTRIES).slice(0, 12);
    allCardsRef.current = allCountries.map((country, index) => ({
      id: index,
      country,
      isFlipped: false,
      isMatched: false
    }));

    setShowIntroModal(true);
  };

  const handleStartGame = () => {
    setShowIntroModal(false);
    initializeLevel(0, difficulty);
    startLevelTimer(difficulty);
  };

  const handleIntroCancel = () => {
    setShowIntroModal(false);
    setDifficulty(null);
  };

  const startLevelTimer = (mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const initialTime = TIMER_CONFIG[mode];
    setTimeRemaining(initialTime);

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = (fromInterval = false) => {
    pauseTimer();

    // If they haven't used their revival yet, offer the Banana Game
    if (!hasRevived) {
      setBananaModalType('timeout'); // This should trigger a modal saying "Time's Up! Play for +30s?"
      // We assume getTimeBonus(difficulty) isn't relevant here if we fix it to 30s, 
      // but you can keep using it if you want dynamic time.
      setBananaBonus(30);
      setShowBananaModal(true);
    } else {
      // User has already revived once and timed out again -> GAME OVER
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    // Logic for when the user truly fails
    alert("Game Over! You ran out of time.");
    clearGameState();
    navigate('/leaderboard'); // Or to a Game Over screen
  };

  const handleBananaModalPlay = async () => {
    setShowBananaModal(false);
    setShowBananaGame(true);
  };

  const handleBananaModalCancel = () => {
    setShowBananaModal(false);
    handleGameOver();
  };

  const selectRandomFlagsFromCards = (cardList) => {
    if (cardList.length === 0) return [];

    const firstFlagIndex = Math.floor(Math.random() * cardList.length);
    let secondFlagIndex = Math.floor(Math.random() * cardList.length);

    while (secondFlagIndex === firstFlagIndex && cardList.length > 1) {
      secondFlagIndex = Math.floor(Math.random() * cardList.length);
    }

    return [
      cardList[firstFlagIndex],
      cardList[secondFlagIndex]
    ];
  };

  const initializeLevel = (levelIndex, difficultyLevel) => {
    const config = LEVEL_CONFIGS[difficultyLevel];
    const levelCards = allCardsRef.current.slice(0, config.cardCount);

    const selectedFlags = selectRandomFlagsFromCards(levelCards);

    setFlagsToFind(selectedFlags);
    setCurrentQuestionIndex(0);
    setLevelScore(0);
    setShowLevelComplete(false);
    setIsRevealing(false);
    setFeedback(null);
    setCards(levelCards);
    setHasRevived(false);
  };

  const getCurrentTargetFlag = () => {
    return flagsToFind[currentQuestionIndex] || null;
  };

  const handleCardClick = (cardId) => {
    if (isPaused || isRevealing || showLevelComplete || !getCurrentTargetFlag()) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const targetFlag = getCurrentTargetFlag();
    const isCorrect = card.country.name === targetFlag.country.name;

    setCards(prev => prev.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c)));
    setIsRevealing(true);
    setFeedback({ cardId, isCorrect });

    // Reset the per-flag timer when the player selects the right flag
        // (unless this was the final question for the level)
        const questionsForLevel = LEVEL_CONFIGS[difficulty]?.questionsPerLevel || 2;
        const isLastQuestion = currentQuestionIndex >= questionsForLevel - 1;
        if (!isLastQuestion) {
          startLevelTimer(difficulty);
        }

    setTimeout(() => {
      if (isCorrect) {
        const points = 100;
        // Increase both level score and total score immediately on correct answer
        setLevelScore(prev => prev + points);
        setScore(prev => prev + points);

        setTimeout(() => {
          if (currentQuestionIndex < 1) {
            // Advance to next flag (level within this difficulty)
            setCurrentQuestionIndex(prev => prev + 1);
            setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
            setFeedback(null);
            setIsRevealing(false);
          } else {
            // Completed all flags for this difficulty
            setShowLevelComplete(true);
            setIsRevealing(false);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === cardId ? { ...c, isFlipped: false } : c)));
          setFeedback(null);
          setIsRevealing(false);
        }, 500);
      }
    }, 200);
  };

  const handleHint = () => {
    if (isPaused || isRevealing || showLevelComplete) return;
    if (hints <= 0) return;

    const targetFlag = getCurrentTargetFlag();
    if (!targetFlag) return;
    const correctCard = cards.find(c => c.country.name === targetFlag.country.name);

    if (!correctCard || correctCard.isFlipped) return;

    setCards(prev => prev.map(c => (c.id === correctCard.id ? { ...c, isFlipped: true } : c)));
    setFeedback({ cardId: correctCard.id, isCorrect: true, isHint: true });

    setTimeout(() => {
      setCards(prev => prev.map(c => (c.id === correctCard.id ? { ...c, isFlipped: false } : c)));
      setFeedback(null);
    }, 1500);

    setHints(h => Math.max(0, h - 1));
    setScore(prev => Math.max(0, prev - 25));
  };

  // const handleLifeline = () => {
  //   if (isPaused || isRevealing || showLevelComplete) return;
  //   setBananaModalType('lifeline');
  //   const bonus = getTimeBonus(difficulty);
  //   setBananaBonus(bonus);
  //   setShowBananaModal(true);
  // };

  const handleBananaGameComplete = (won) => {
    setShowBananaGame(false); // Close the mini-game

    if (won) {
      // User won the mini-game: Add 30 seconds
      const bonusTime = 30; 
      setTimeRemaining(bonusTime);
      setHasRevived(true); // Mark revival as used so they can't do it again this level
      
      // Resume the main game
      resumeTimer();
    } else {
      // User failed the mini-game
      handleGameOver();
    }
  };

  const handlePause = () => {
    setShowPauseModal(true);
    pauseTimer();
  };

  const handleResumePause = () => {
    setShowPauseModal(false);
    setIsPaused(false);
    resumeTimer();
  };

  const handleQuitFromPause = () => {
    setShowPauseModal(false);
    clearGameState();
    navigate('/home');
  };

  const handleResumeSavedGame = () => {
    if (savedGameState) {
      setDifficulty(savedGameState.difficulty);
      setCurrentLevel(savedGameState.currentLevel);
      setScore(savedGameState.score);
      setHints(savedGameState.hintsRemaining);
      setCurrentQuestionIndex(savedGameState.currentQuestionIndex);
      setFlagsToFind(savedGameState.flagsToFind);
      allCardsRef.current = savedGameState.cards;
      setCards(savedGameState.cards);
      setTimeRemaining(savedGameState.timeRemaining);
      setHasRevived(savedGameState.hasRevived || false);
      setShowResumeModal(false);
      startLevelTimer(savedGameState.difficulty);
    }
  };

  const handleStartNewGame = () => {
    clearGameState();
    setShowResumeModal(false);
    setSavedGameState(null);
  };

  const handleNextLevel = async () => {
    try {
      await api.delete('/game/clear');
      await api.post('/user/score', { finalScore: score });

      const currentDifficulty = levels[currentLevel];
      await api.post('/user/complete-level', { difficulty: currentDifficulty });

      const { data } = await api.get('/user/progression');
      setUnlockedLevels(data.unlockedLevels);
    } catch (err) {
      console.error('Failed to clear game, save score, or complete level', err);
    }
    clearGameState();
    const nextLevelIndex = currentLevel + 1;
    if (nextLevelIndex < levels.length) {
      const nextDifficulty = levels[nextLevelIndex];
      setDifficulty(nextDifficulty);
      setCurrentLevel(nextLevelIndex);
      setHints(2);
      setHasRevived(false);
      setShowLevelComplete(false);
      setShowIntroModal(true);
    } else {
      navigate('/home');
    }
  };

  const handleLevelCompleteExit = () => {
    clearGameState();
    navigate('/home');
  };

  const handleHome = () => {
    navigate('/home');
  };

  const targetFlag = getCurrentTargetFlag();

  if (!difficulty) {
    return (
      <div className="game-difficulty-container">
        <div className="game-difficulty-background">
          <div className="game-difficulty-bg-gradient"></div>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/95fcb03ba37465ca39e626cc4bdadf43a19c8091?width=2816"
            alt=""
            className="game-difficulty-map-image"
          />
          <div className="game-difficulty-compass-decoration">
            <svg width="360" height="360" viewBox="0 0 349 361" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M180.115 342.215C269.642 342.215 342.218 269.638 342.218 180.111C342.218 90.584 269.642 18.0078 180.115 18.0078C90.5879 18.0078 18.0117 90.584 18.0117 180.111C18.0117 269.638 90.5879 342.215 180.115 342.215Z" stroke="#D4AF37" />
              <path d="M180.116 306.192C249.748 306.192 306.196 249.744 306.196 180.112C306.196 110.479 249.748 54.0312 180.116 54.0312C110.483 54.0312 54.0352 110.479 54.0352 180.112C54.0352 249.744 110.483 306.192 180.116 306.192Z" stroke="#D4AF37" />
              <path d="M197.597 161.919L180.112 179.403L162.628 161.919L180.112 22.0391L197.597 161.919Z" fill="black" stroke="#D4AF37" />
              <path opacity="0.7" d="M338.185 180.112L198.305 197.597L180.82 180.112L198.305 162.628L338.185 180.112Z" fill="black" stroke="#D4AF37" />
              <path opacity="0.5" d="M197.597 198.309L180.112 338.188L162.628 198.309L180.112 180.824L197.597 198.309Z" fill="black" stroke="#D4AF37" />
              <path opacity="0.6" d="M179.407 180.112L161.923 197.597L22.043 180.112L161.923 162.628L179.407 180.112Z" fill="black" stroke="#D4AF37" />
            </svg>
          </div>
        </div>

        <header className="game-difficulty-header">
          <button className="game-difficulty-back-btn" onClick={handleHome}>
            <span>←</span>
            <span>Back to Port</span>
          </button>
          <h1 className="game-difficulty-title">Flag Memory Game</h1>
          <div className="game-difficulty-header-spacer"></div>
        </header>

        <main className="game-difficulty-main">
          <div className="game-difficulty-modal">
            <div className="game-difficulty-corner game-difficulty-corner-tl"></div>
            <div className="game-difficulty-corner game-difficulty-corner-tr"></div>
            <div className="game-difficulty-corner game-difficulty-corner-bl"></div>
            <div className="game-difficulty-corner game-difficulty-corner-br"></div>

            <h2 className="game-difficulty-heading">Choose Your Difficulty Level</h2>
            <p className="game-difficulty-desc">Select a level to test your memory skills</p>

            <div className="game-difficulty-options">
              <button
                className={`game-difficulty-option ${!unlockedLevels.includes('easy') ? 'game-difficulty-option-locked' : ''}`}
                onClick={() => handleDifficultySelect('easy')}
                disabled={!unlockedLevels.includes('easy')}
              >
                <div className="game-difficulty-option-icon">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="26" stroke="#D4AF37" strokeWidth="2" />
                    <path d="M20 28H36M28 20V36" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="game-difficulty-option-title">Easy</h3>
                <p className="game-difficulty-option-desc">4 Cards</p>
              </button>

              <button
                className={`game-difficulty-option ${!unlockedLevels.includes('medium') ? 'game-difficulty-option-locked' : ''}`}
                onClick={() => handleDifficultySelect('medium')}
                disabled={!unlockedLevels.includes('medium')}
              >
                {!unlockedLevels.includes('medium') && (
                  <div className="difficulty-lock-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 10V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V10M6 10H18C19.1 10 20 10.9 20 12V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <div className="game-difficulty-option-icon">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="44" height="44" rx="2" stroke="#D4AF37" strokeWidth="2" />
                    <line x1="28" y1="6" x2="28" y2="50" stroke="#D4AF37" strokeWidth="2" />
                    <line x1="6" y1="28" x2="50" y2="28" stroke="#D4AF37" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="game-difficulty-option-title">Medium</h3>
                <p className="game-difficulty-option-desc">8 Cards</p>
                {!unlockedLevels.includes('medium') && (
                  <p className="game-difficulty-option-locked-text">Complete Easy first</p>
                )}
              </button>

              <button
                className={`game-difficulty-option ${!unlockedLevels.includes('hard') ? 'game-difficulty-option-locked' : ''}`}
                onClick={() => handleDifficultySelect('hard')}
                disabled={!unlockedLevels.includes('hard')}
              >
                {!unlockedLevels.includes('hard') && (
                  <div className="difficulty-lock-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 10V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V10M6 10H18C19.1 10 20 10.9 20 12V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <div className="game-difficulty-option-icon">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="28" cy="28" r="26" stroke="#D4AF37" strokeWidth="2" />
                    <path d="M28 10C19.7 10 12.8 16.9 12.8 25.2C12.8 33.5 19.7 40.4 28 40.4C36.3 40.4 43.2 33.5 43.2 25.2" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="game-difficulty-option-title">Hard</h3>
                <p className="game-difficulty-option-desc">12 Cards</p>
                {!unlockedLevels.includes('hard') && (
                  <p className="game-difficulty-option-locked-text">Complete Medium first</p>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-background-overlay"></div>
      <div className="game-background-gradient"></div>
      <div className="game-blur-effect game-blur-cyan"></div>
      <div className="game-blur-effect game-blur-purple"></div>
      <div className="game-blur-light game-blur-light-1"></div>
      <div className="game-blur-light game-blur-light-2"></div>

      <header className="game-header">
        <div className="game-header-content">
          <div className="level-indicator-badge">
            <span>{levels[currentLevel].toUpperCase()} - Question {currentQuestionIndex + 1}/2</span>
          </div>

          <TimerDisplay timeRemaining={timeRemaining} />

          <div className="target-badge">
            <span>Find: {targetFlag ? targetFlag.country.name : '...'}</span>
          </div>

          <div className="level-score-container">
            <div className="score-badge">
              <span>Level: {currentQuestionIndex + 1} | Score: {score}</span>
            </div>
          </div>

          <button className="home-button" onClick={handleHome} aria-label="Home">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 17.5V10.8333C12.5 10.6123 12.4122 10.4004 12.2559 10.2441C12.0996 10.0878 11.8877 10 11.6667 10H8.33333C8.11232 10 7.90036 10.0878 7.74408 10.2441C7.5878 10.4004 7.5 10.6123 7.5 10.8333V17.5" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.5 8.3303C2.49994 8.08785 2.55278 7.84831 2.65482 7.62839C2.75687 7.40847 2.90566 7.21346 3.09083 7.05696L8.92417 2.0578C9.22499 1.80355 9.60613 1.66406 10 1.66406C10.3939 1.66406 10.775 1.80355 11.0758 2.0578L16.9092 7.05696C17.0943 7.21346 17.2431 7.40847 17.3452 7.62839C17.4472 7.84831 17.5001 8.08785 17.5 8.3303V15.8303C17.5 16.2723 17.3244 16.6962 17.0118 17.0088C16.6993 17.3214 16.2754 17.497 15.8333 17.497H4.16667C3.72464 17.497 3.30072 17.3214 2.98816 17.0088C2.67559 16.6962 2.5 16.2723 2.5 15.8303V8.3303Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      <main className="game-main">
        {!showLevelComplete && (
          <div className="game-content level-transition">
            {targetFlag && (
              <div className="target-flag-section">
                <div className="find-flag-badge">
                  <svg width="28" height="28" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6936 18.2382C11.5886 17.8309 11.3763 17.4593 11.0789 17.1619C10.7815 16.8645 10.4099 16.6522 10.0026 16.5472L2.78319 14.6855C2.66002 14.6506 2.55162 14.5764 2.47442 14.4742C2.39723 14.3721 2.35547 14.2475 2.35547 14.1195C2.35547 13.9915 2.39723 13.8669 2.47442 13.7648C2.55162 13.6626 2.66002 13.5884 2.78319 13.5535L10.0026 11.6907C10.4097 11.5857 10.7813 11.3736 11.0787 11.0764C11.376 10.7793 11.5884 10.4079 11.6936 10.0008L13.5553 2.78137C13.5899 2.65772 13.664 2.54878 13.7663 2.47117C13.8686 2.39357 13.9935 2.35156 14.1219 2.35156C14.2503 2.35156 14.3752 2.39357 14.4775 2.47117C14.5798 2.54878 14.6539 2.65772 14.6885 2.78137L16.549 10.0008C16.654 10.4081 16.8663 10.7797 17.1637 11.0771C17.4611 11.3745 17.8327 11.5868 18.24 11.6918L25.4594 13.5523C25.5836 13.5865 25.693 13.6606 25.7711 13.763C25.8491 13.8655 25.8913 13.9907 25.8913 14.1195C25.8913 14.2483 25.8491 14.3735 25.7711 14.476C25.693 14.5784 25.5836 14.6525 25.4594 14.6867L18.24 16.5472C17.8327 16.6522 17.4611 16.8645 17.1637 17.1619C16.8663 17.4593 16.654 17.8309 16.549 18.2382L14.6873 25.4576C14.6527 25.5813 14.5786 25.6902 14.4763 25.7678C14.374 25.8454 14.2491 25.8874 14.1207 25.8874C13.9923 25.8874 13.8674 25.8454 13.7651 25.7678C13.6628 25.6902 13.5887 25.5813 13.5541 25.4576L11.6936 18.2382Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M23.5352 3.53125V8.23831" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M25.8906 5.88281H21.1836" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.70703 20.0078V22.3613" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.88478 21.1797H3.53125" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Find this flag!</span>
                </div>

                <div className="flag-display-card">
                  <div className="flag-corner flag-corner-tl"></div>
                  <div className="flag-corner flag-corner-tr"></div>
                  <div className="flag-corner flag-corner-bl"></div>
                  <div className="flag-corner flag-corner-br"></div>
                  <img src={targetFlag.country.flag} alt={targetFlag.country.name} className="target-flag-image" />
                </div>

                <button className="country-name-button" type="button">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0013 18.3307C14.6037 18.3307 18.3346 14.5998 18.3346 9.9974C18.3346 5.39502 14.6037 1.66406 10.0013 1.66406C5.39893 1.66406 1.66797 5.39502 1.66797 9.9974C1.66797 14.5998 5.39893 18.3307 10.0013 18.3307Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.0013 1.66406C7.8615 3.91086 6.66797 6.89468 6.66797 9.9974C6.66797 13.1001 7.8615 16.0839 10.0013 18.3307C12.1411 16.0839 13.3346 13.1001 13.3346 9.9974C13.3346 6.89468 12.1411 3.91086 10.0013 1.66406Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1.66797 10H18.3346" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{targetFlag.country.name}</span>
                </button>
              </div>
            )}

            <div
              className="cards-grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize.cols}, 160px)`,
                gridTemplateRows: `repeat(${gridSize.rows}, 110px)`
              }}
            >
              {cards.map(card => (
                <div
                  key={card.id}
                  className={`game-card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(card.id)}
                  aria-label={`Card ${card.id + 1}`}
                >
                  <div className="card-inner">
                    <div className="card-front">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 30C8 30 10 28 16 28C22 28 26 32 32 32C38 32 40 30 40 30V6C40 6 38 8 32 8C26 8 22 4 16 4C10 4 8 6 8 6V30Z" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 44V30" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="card-back">
                      <img src={card.country.flag} alt={card.country.name} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showLevelComplete && (
          <div className="results-card level-transition">
            <h2 className="results-title">{levels[currentLevel].toUpperCase()} Complete!</h2>
            <div className="results-stats">
              <div className="results-stat"><span className="results-label">Level Score</span><span className="results-value">{levelScore}</span></div>
              <div className="results-stat"><span className="results-label">Total Score</span><span className="results-value">{score + levelScore}</span></div>
            </div>
            <div className="results-button-group">
              {currentLevel < levels.length - 1 ? (
                <button className="results-button" onClick={handleNextLevel}>
                  Continue to {levels[currentLevel + 1].toUpperCase()}
                </button>
              ) : (
                <>
                  <button className="results-button" onClick={handleNextLevel}>
                    Game Complete!
                  </button>
                  <button className="results-button-secondary" onClick={() => navigate('/home')}>
                    Back to Home
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="game-footer">
        <div className="game-footer-content">
          <button className="footer-button" onClick={handlePause} aria-label="Pause">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.168 3.33594H12.5013C12.0411 3.33594 11.668 3.70903 11.668 4.16927V15.8359C11.668 16.2962 12.0411 16.6693 12.5013 16.6693H14.168C14.6282 16.6693 15.0013 16.2962 15.0013 15.8359V4.16927C15.0013 3.70903 14.6282 3.33594 14.168 3.33594Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.5 3.33594H5.83333C5.3731 3.33594 5 3.70903 5 4.16927V15.8359C5 16.2962 5.3731 16.6693 5.83333 16.6693H7.5C7.96024 16.6693 8.33333 16.2962 8.33333 15.8359V4.16927C8.33333 3.70903 7.96024 3.33594 7.5 3.33594Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button className="footer-button" onClick={handleHint} aria-label="Hint">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1.66406C5.39893 1.66406 1.66797 5.39502 1.66797 9.9974C1.66797 14.5998 5.39893 18.3307 10 18.3307C14.6013 18.3307 18.3323 14.5998 18.3323 9.9974C18.3323 5.39502 14.6013 1.66406 10 1.66406Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.0013 14.168V10.0013" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.0013 6.66797C10.2223 6.66797 10.4342 6.57618 10.5905 6.41991C10.7468 6.26363 10.8387 6.05168 10.8387 5.83073C10.8387 5.60978 10.7468 5.39783 10.5905 5.24155C10.4342 5.08528 10.2223 4.99349 10.0013 4.99349C9.78035 4.99349 9.5684 5.08528 9.41213 5.24155C9.25585 5.39783 9.16406 5.60978 9.16406 5.83073C9.16406 6.05168 9.25585 6.26363 9.41213 6.41991C9.5684 6.57618 9.78035 6.66797 10.0013 6.66797Z" fill="#4B5563" />
            </svg>
            <span>{hints}</span>
          </button>

          {/* <button className="footer-button lifeline-button" onClick={handleLifeline} aria-label="Lifeline" title="Play banana game to earn extra time">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 10.5C4.5 10.5 5 7 10 7C15 7 15.5 10.5 15.5 10.5M5 13.5C5 13.5 6 15 10 15C14 15 15 13.5 15 13.5M8 11C8 11.8284 7.55228 12.5 7 12.5C6.44772 12.5 6 11.8284 6 11C6 10.1716 6.44772 9.5 7 9.5C7.55228 9.5 8 10.1716 8 11ZM14 11C14 11.8284 13.5523 12.5 13 12.5C12.4477 12.5 12 11.8284 12 11C12 10.1716 12.4477 9.5 13 9.5C13.5523 9.5 14 10.1716 14 11Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button> */}

          <div className="footer-spacer"></div>

          <button className="footer-button" onClick={() => setDifficulty(null)} aria-label="Difficulty">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18.3307C14.6037 18.3307 18.3346 14.5998 18.3346 9.9974C18.3346 5.39502 14.6037 1.66406 10 1.66406C5.39893 1.66406 1.66797 5.39502 1.66797 9.9974C1.66797 14.5998 5.39893 18.3307 10 18.3307Z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.5 12.5L10 10L12.5 12.5" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7.5 7.5L10 10L12.5 7.5" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </footer>

      {showBananaGame && (
        <BananaGame onComplete={handleBananaGameComplete} onClose={() => setShowBananaGame(false)} />
      )}

      {showIntroModal && (
        <IntroModal
          difficulty={difficulty}
          cardCount={cardCount}
          hintsRemaining={hints}
          onStart={handleStartGame}
          onCancel={handleIntroCancel}
        />
      )}

      {showBananaModal && (
        <BananaModal
          type={bananaModalType}
          bonusTime={bananaBonus}
          onPlay={handleBananaModalPlay}
          onCancel={handleBananaModalCancel}
        />
      )}

      {showLevelComplete && (
        <LevelCompleteModal
          difficulty={difficulty}
          score={score}
          isLastLevel={currentLevel === levels.length - 1}
          onContinue={handleNextLevel}
          onExit={handleLevelCompleteExit}
        />
      )}

      {showPauseModal && (
        <PauseModal
          onResume={handleResumePause}
          onQuit={handleQuitFromPause}
        />
      )}

      {showResumeModal && savedGameState && (
        <ResumeGameModal
          difficulty={savedGameState.difficulty}
          onContinue={handleResumeSavedGame}
          onStartNew={handleStartNewGame}
        />
      )}
    </div>
  );
}

export default Game;
