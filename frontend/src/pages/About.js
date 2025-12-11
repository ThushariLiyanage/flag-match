import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-background">
        <div className="about-bg-gradient"></div>
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/95fcb03ba37465ca39e626cc4bdadf43a19c8091?width=2816" 
          alt="" 
          className="about-map-image"
        />
      </div>

      <header className="about-header">
        <div className="about-header-content">
          <button className="about-back-btn" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#FCE8A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 10H16.6667" stroke="#FCE8A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="about-back-label">Back to Port</span>
          </button>
          <h1 className="about-title">About Flag Match</h1>
          <div className="about-header-spacer"></div>
        </div>
      </header>

      <main className="about-main">
        <div className="about-content-wrapper">
          <div className="about-card">
            <div className="about-corner about-corner-tl"></div>
            <div className="about-corner about-corner-tr"></div>
            <div className="about-corner about-corner-bl"></div>
            <div className="about-corner about-corner-br"></div>

            <section className="about-section">
              <h2 className="about-section-title">How to Play</h2>
              <div className="about-section-content">
                <div className="about-step">
                  <div className="about-step-number">1</div>
                  <div className="about-step-content">
                    <h3>Choose Your Difficulty</h3>
                    <p>Start with Easy mode (4 cards). After completing Easy, unlock Medium (8 cards). Complete Medium to unlock Hard (12 cards).</p>
                  </div>
                </div>

                <div className="about-step">
                  <div className="about-step-number">2</div>
                  <div className="about-step-content">
                    <h3>Match the Flags</h3>
                    <p>A flag is shown at the top. You have 10 seconds per question to find it among the hidden cards. Click on the card you think matches the target flag.</p>
                  </div>
                </div>

                <div className="about-step">
                  <div className="about-step-number">3</div>
                  <div className="about-step-content">
                    <h3>Solve Questions</h3>
                    <p>Each difficulty level has 2 questions. Answer both correctly to complete the level and move to the next one.</p>
                  </div>
                </div>

                <div className="about-step">
                  <div className="about-step-number">4</div>
                  <div className="about-step-content">
                    <h3>Use Your Hints</h3>
                    <p>You get 1 hints per level. Use them wisely to reveal the correct flag temporarily. Hints cost 25 points.</p>
                  </div>
                </div>

                <div className="about-step">
                  <div className="about-step-number">5</div>
                  <div className="about-step-content">
                    <h3>Beat the Clock</h3>
                    <p>Each question gives you 10 seconds. If time runs out, play the Banana Challenge to earn extra time and continue your voyage.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="about-section">
              <h2 className="about-section-title">Game Features</h2>
              <div className="about-features-grid">
                <div className="about-feature">
                  <div className="about-feature-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 10V26C6 27.0609 6.42143 28.0783 7.17157 28.8284C7.92172 29.5786 8.93913 30 10 30H22C23.0609 30 24.0783 29.5786 24.8284 28.8284C25.5786 28.0783 26 27.0609 26 26V10M2 6H30M8 6V4C8 2.89543 8.89543 2 10 2H22C23.1046 2 24 2.89543 24 4V6M13 14V22M19 14V22" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Progressive Difficulty</h3>
                  <p>Unlock new levels as you master each one</p>
                </div>

                <div className="about-feature">
                  <div className="about-feature-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM16 6.5C16.9941 6.5 18.1038 6.5 19.125 7.125M16 6.5C17.9 8.025 18.5 11.175 18.5 14C18.5 16.825 17.9 19.975 16 21.5M16 6.5C14.0 8.025 13.5 11.175 13.5 14C13.5 16.825 14.0 19.975 16 21.5M16 21.5C14.0962 23.525 11.5 24.85 8.75 24.85M16 21.5C17.904 23.525 20.5 24.85 23.25 24.85" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Global Leaderboard</h3>
                  <p>Compete with players worldwide for the top rank</p>
                </div>

                <div className="about-feature">
                  <div className="about-feature-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4ZM16 8V16L21 19.5" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Time Challenge</h3>
                  <p>Beat the clock to earn more points and prove your skills</p>
                </div>

                <div className="about-feature">
                  <div className="about-feature-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 14C8 19.3 11.3 23.9 16 25.8C20.7 23.9 24 19.3 24 14C24 7.4 20.4 2 16 2C11.6 2 8 7.4 8 14ZM16 8C18.2 8 20 9.8 20 12C20 14.2 18.2 16 16 16C13.8 16 12 14.2 12 12C12 9.8 13.8 8 16 8Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Strategic Hints</h3>
                  <p>Use your limited hints to identify difficult flags</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default About;
