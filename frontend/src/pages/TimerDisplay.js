import React from 'react';
import './TimerDisplay.css';

function TimerDisplay({ timeRemaining }) {
  const isDanger = timeRemaining <= 3;

  return (
    <div className={`timer-display ${isDanger ? 'timer-danger' : ''}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 5V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{String(timeRemaining).padStart(2, '0')}s</span>
    </div>
  );
}

export default TimerDisplay;
