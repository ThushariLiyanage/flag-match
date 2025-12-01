import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    highestLevel: 'None',
    rank: 'Cadet',
    totalScore: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileRes, progressionRes, leaderboardRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/user/progression'),
          api.get('/leaderboard')
        ]);

        const profile = profileRes.data;
        const progression = progressionRes.data;
        const leaderboard = leaderboardRes.data;

        const completedLevels = progression.completedLevels || [];
        let highestLevel = 'None';

        if (completedLevels.includes('hard')) {
          highestLevel = 'Hard';
        } else if (completedLevels.includes('medium')) {
          highestLevel = 'Medium';
        } else if (completedLevels.includes('easy')) {
          highestLevel = 'Easy';
        }

        let userRank = 'Unranked';
        const currentUser = leaderboard.find(user => user.isCurrentUser);
        if (currentUser) {
          userRank = `#${currentUser.rank}`;
        }

        setUserStats({
          highestLevel,
          rank: userRank,
          totalScore: profile.totalScore || 0
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setUserStats({
          highestLevel: 'None',
          rank: 'Unranked',
          totalScore: 0
        });
      }
    };

    fetchUserData();
  }, []);

  const handleStartGame = () => {
    navigate('/game');
  };

  const handleContinueGame = () => {
    navigate('/game');
  };

  const handleSettingsClick = () => {
    navigate('/profile');
  };

  return (
    <div className="nautical-home-container">
      <div className="nautical-background">
        <div className="nautical-bg-gradient"></div>
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/95fcb03ba37465ca39e626cc4bdadf43a19c8091?width=2816" 
          alt="" 
          className="nautical-map-image"
        />
        <div className="nautical-compass-decoration">
          <svg width="360" height="360" viewBox="0 0 349 361" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M180.115 342.215C269.642 342.215 342.218 269.638 342.218 180.111C342.218 90.584 269.642 18.0078 180.115 18.0078C90.5879 18.0078 18.0117 90.584 18.0117 180.111C18.0117 269.638 90.5879 342.215 180.115 342.215Z" stroke="#D4AF37"/>
            <path d="M180.116 306.192C249.748 306.192 306.196 249.744 306.196 180.112C306.196 110.479 249.748 54.0312 180.116 54.0312C110.483 54.0312 54.0352 110.479 54.0352 180.112C54.0352 249.744 110.483 306.192 180.116 306.192Z" stroke="#D4AF37"/>
            <path d="M197.597 161.919L180.112 179.403L162.628 161.919L180.112 22.0391L197.597 161.919Z" fill="black" stroke="#D4AF37"/>
            <path opacity="0.7" d="M338.185 180.112L198.305 197.597L180.82 180.112L198.305 162.628L338.185 180.112Z" fill="black" stroke="#D4AF37"/>
            <path opacity="0.5" d="M197.597 198.309L180.112 338.188L162.628 198.309L180.112 180.824L197.597 198.309Z" fill="black" stroke="#D4AF37"/>
            <path opacity="0.6" d="M179.407 180.112L161.923 197.597L22.043 180.112L161.923 162.628L179.407 180.112Z" fill="black" stroke="#D4AF37"/>
          </svg>
        </div>
        <div className="nautical-ship-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40.0039 33.9688V46.6735" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M40.0039 6.66406V16.6652" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M63.34 43.3416V23.3393C63.34 21.571 62.6375 19.8751 61.3871 18.6247C60.1367 17.3743 58.4409 16.6719 56.6725 16.6719H23.3354C21.5671 16.6719 19.8712 17.3743 18.6208 18.6247C17.3704 19.8751 16.668 21.571 16.668 23.3393V43.3416" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M64.6075 66.6767C68.1935 60.6246 70.0607 53.7089 70.0081 46.6744L42.7116 34.543C41.8594 34.1644 40.9372 33.9688 40.0047 33.9688C39.0721 33.9688 38.1499 34.1644 37.2977 34.543L10.0012 46.6744C9.8469 56.1544 13.1806 65.3608 19.369 72.544" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.66797 70.0052C8.6682 71.6719 10.6684 73.3385 15.0023 73.3385C23.3365 73.3385 23.3365 66.6719 31.6708 66.6719C36.0047 66.6719 38.0049 68.3385 40.0051 70.0052C42.0053 71.6719 44.0056 73.3385 48.3394 73.3385C56.6737 73.3385 56.6737 66.6719 65.008 66.6719C69.3418 66.6719 71.342 68.3385 73.3423 70.0052" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="nautical-treasure-icon">
          <svg width="167" height="167" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M113.091 54.0391L100.529 91.7198C99.8452 93.7712 98.6932 95.6352 97.1642 97.1642C95.6352 98.6932 93.7712 99.8452 91.7198 100.529L54.0391 113.091L66.6016 75.4108C67.2853 73.3594 68.4373 71.4953 69.9663 69.9663C71.4953 68.4373 73.3593 67.2853 75.4107 66.6016L113.091 54.0391Z" stroke="#C9A959" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M83.563 153.204C122.023 153.204 153.2 122.027 153.2 83.567C153.2 45.1074 122.023 13.9297 83.563 13.9297C45.1034 13.9297 13.9258 45.1074 13.9258 83.567C13.9258 122.027 45.1034 153.204 83.563 153.204Z" stroke="#C9A959" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <header className="nautical-header">
        <div className="nautical-header-content">
          <div className="nautical-brand">
            <div className="nautical-anchor-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 29.3307V10.6641" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.66797 16H2.66797C2.66797 19.5362 4.07273 22.9276 6.57321 25.4281C9.0737 27.9286 12.4651 29.3333 16.0013 29.3333C19.5375 29.3333 22.9289 27.9286 25.4294 25.4281C27.9299 22.9276 29.3346 19.5362 29.3346 16H25.3346" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 10.6641C18.2091 10.6641 20 8.8732 20 6.66406C20 4.45492 18.2091 2.66406 16 2.66406C13.7909 2.66406 12 4.45492 12 6.66406C12 8.8732 13.7909 10.6641 16 10.6641Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="nautical-brand-text">
              <h2 className="nautical-brand-name">Flag Match</h2>
              <p className="nautical-brand-tagline">A Voyage of Discovery</p>
            </div>
          </div>
          <button className="nautical-settings-btn" onClick={handleSettingsClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.218 2H11.778C11.2476 2 10.7389 2.21071 10.3638 2.58579C9.98876 2.96086 9.77805 3.46957 9.77805 4V4.18C9.77769 4.53073 9.68511 4.87519 9.50959 5.17884C9.33407 5.48248 9.08179 5.73464 8.77805 5.91L8.34805 6.16C8.04401 6.33554 7.69912 6.42795 7.34805 6.42795C6.99698 6.42795 6.65209 6.33554 6.34805 6.16L6.19805 6.08C5.73911 5.81526 5.19389 5.74344 4.68205 5.88031C4.17022 6.01717 3.7336 6.35154 3.46805 6.81L3.24805 7.19C2.98331 7.64893 2.91149 8.19416 3.04836 8.706C3.18522 9.21783 3.51958 9.65445 3.97805 9.92L4.12805 10.02C4.43032 10.1945 4.68167 10.4451 4.8571 10.7468C5.03253 11.0486 5.12594 11.391 5.12805 11.74V12.25C5.12945 12.6024 5.0377 12.949 4.86209 13.2545C4.68649 13.5601 4.43326 13.8138 4.12805 13.99L3.97805 14.08C3.51958 14.3456 3.18522 14.7822 3.04836 15.294C2.91149 15.8058 2.98331 16.3511 3.24805 16.81L3.46805 17.19C3.7336 17.6485 4.17022 17.9828 4.68205 18.1197C5.19389 18.2566 5.73911 18.1847 6.19805 17.92L6.34805 17.84C6.65209 17.6645 6.99698 17.5721 7.34805 17.5721C7.69912 17.5721 8.04401 17.6645 8.34805 17.84L8.77805 18.09C9.08179 18.2654 9.33407 18.5175 9.50959 18.8212C9.68511 19.1248 9.77769 19.4693 9.77805 19.82V20C9.77805 20.5304 9.98876 21.0391 10.3638 21.4142C10.7389 21.7893 11.2476 22 11.778 22H12.218C12.7485 22 13.2572 21.7893 13.6323 21.4142C14.0073 21.0391 14.218 20.5304 14.218 20V19.82C14.2184 19.4693 14.311 19.1248 14.4865 18.8212C14.662 18.5175 14.9143 18.2654 15.218 18.09L15.648 17.84C15.9521 17.6645 16.297 17.5721 16.648 17.5721C16.9991 17.5721 17.344 17.6645 17.648 17.84L17.798 17.92C18.257 18.1847 18.8022 18.2566 19.314 18.1197C19.8259 17.9828 20.2625 17.6485 20.528 17.19L20.748 16.8C21.0128 16.3411 21.0846 15.7958 20.9477 15.284C20.8109 14.7722 20.4765 14.3356 20.018 14.07L19.868 13.99C19.5628 13.8138 19.3096 13.5601 19.134 13.2545C18.9584 12.949 18.8667 12.6024 18.868 12.25V11.75C18.8667 11.3976 18.9584 11.051 19.134 10.7455C19.3096 10.4399 19.5628 10.1862 19.868 10.01L20.018 9.92C20.4765 9.65445 20.8109 9.21783 20.9477 8.706C21.0846 8.19416 21.0128 7.64893 20.748 7.19L20.528 6.81C20.2625 6.35154 19.8259 6.01717 19.314 5.88031C18.8022 5.74344 18.257 5.81526 17.798 6.08L17.648 6.16C17.344 6.33554 16.9991 6.42795 16.648 6.42795C16.297 6.42795 15.9521 6.33554 15.648 6.16L15.218 5.91C14.9143 5.73464 14.662 5.48248 14.4865 5.17884C14.311 4.87519 14.2184 4.53073 14.218 4.18V4C14.218 3.46957 14.0073 2.96086 13.6323 2.58579C13.2572 2.21071 12.7485 2 12.218 2Z" stroke="#FFCF33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#FFCF33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="nautical-main">
        <div className="nautical-content-wrapper">
          <div className="nautical-voyage-modal">
            <div className="modal-corner modal-corner-tl"></div>
            <div className="modal-corner modal-corner-tr"></div>
            <div className="modal-corner modal-corner-bl"></div>
            <div className="modal-corner modal-corner-br"></div>
            
            <div className="modal-icon-section">
              <div className="modal-icon-bg">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.51 9.25218C23.9727 9.48337 24.4828 9.60373 25 9.60373C25.5172 9.60373 26.0273 9.48337 26.49 9.25218L32.5883 6.20218C32.8426 6.07511 33.1252 6.01519 33.4092 6.02813C33.6931 6.04106 33.9691 6.12641 34.2108 6.27606C34.4525 6.42572 34.6518 6.6347 34.79 6.88315C34.9281 7.13159 35.0004 7.41124 35 7.69551V28.9688C34.9998 29.2783 34.9135 29.5816 34.7508 29.8447C34.588 30.1079 34.3551 30.3205 34.0783 30.4588L26.49 34.2538C26.0273 34.485 25.5172 34.6054 25 34.6054C24.4828 34.6054 23.9727 34.485 23.51 34.2538L16.49 30.7438C16.0273 30.5126 15.5172 30.3923 15 30.3923C14.4828 30.3923 13.9727 30.5126 13.51 30.7438L7.41167 33.7938C7.15726 33.921 6.87454 33.9809 6.59043 33.9679C6.30632 33.9549 6.03026 33.8694 5.78853 33.7195C5.5468 33.5697 5.34744 33.3605 5.20942 33.1118C5.07139 32.8631 4.9993 32.5833 5.00001 32.2988V11.0272C5.00017 10.7177 5.08648 10.4145 5.24926 10.1513C5.41204 9.88814 5.64487 9.6755 5.92167 9.53718L13.51 5.74218C13.9727 5.51098 14.4828 5.39063 15 5.39062C15.5172 5.39063 16.0273 5.51098 16.49 5.74218L23.51 9.25218Z" stroke="#FFCF33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25 9.60938V34.6094" stroke="#FFCF33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 5.39062V30.3906" stroke="#FFCF33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <h1 className="modal-title">Ready to Set Sail?</h1>
            <p className="modal-description">
              Match flags to nations and chart your course through <br />history
            </p>

            <button className="modal-primary-btn" onClick={handleStartGame}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_voyage)">
                  <path d="M10 8.49219V11.668" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 1.66406V4.16406" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.8346 10.8307V5.83073C15.8346 5.3887 15.659 4.96478 15.3465 4.65222C15.0339 4.33966 14.61 4.16406 14.168 4.16406H5.83464C5.39261 4.16406 4.96868 4.33966 4.65612 4.65222C4.34356 4.96478 4.16797 5.3887 4.16797 5.83073V10.8307" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.1513 16.6682C17.0477 15.1554 17.5144 13.4267 17.5013 11.6682L10.6779 8.63573C10.4649 8.54109 10.2344 8.49219 10.0013 8.49219C9.76817 8.49219 9.53765 8.54109 9.32461 8.63573L2.50128 11.6682C2.46271 14.038 3.29605 16.3393 4.84295 18.1349" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.66797 17.4974C2.16797 17.9141 2.66797 18.3307 3.7513 18.3307C5.83464 18.3307 5.83464 16.6641 7.91797 16.6641C9.0013 16.6641 9.5013 17.0807 10.0013 17.4974C10.5013 17.9141 11.0013 18.3307 12.0846 18.3307C14.168 18.3307 14.168 16.6641 16.2513 16.6641C17.3346 16.6641 17.8346 17.0807 18.3346 17.4974" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_voyage">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span>Begin New Voyage</span>
            </button>

            <button className="modal-secondary-btn" onClick={handleContinueGame}>
              Continue Journey
            </button>
          </div>

          <div className="nautical-stats-grid">
            <div className="nautical-stat-card">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2.33594C7.55538 2.33594 2.33203 7.55928 2.33203 14.0026C2.33203 20.4459 7.55538 25.6693 14 25.6693C20.4346 25.6693 25.6654 20.4459 25.6654 14.0026C25.6654 7.55928 20.4346 2.33594 14 2.33594Z" stroke="#163B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 6.58594V14.0026L18.9346 17.4776" stroke="#163B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="stat-value">{userStats.highestLevel}</div>
              <div className="stat-label">Level Done</div>
            </div>

            <div className="nautical-stat-card">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2.33594C10.1269 2.33594 6.32377 3.46268 3.22183 5.53632C0.119893 7.60996 -0.776859 10.4273 0.599904 12.947C2.64401 17.1186 6.20948 20.1426 10.5 21.3693V25.6693C10.5 26.2013 10.7107 26.7157 11.0858 27.0908C11.4609 27.4659 11.9753 27.6766 12.5073 27.6766H15.4927C16.0247 27.6766 16.5391 27.4659 16.9142 27.0908C17.2893 26.7157 17.5 26.2013 17.5 25.6693V21.3693C21.7905 20.1426 25.356 17.1186 27.4001 12.947C28.7769 10.4273 27.8801 7.60996 24.7782 5.53632C21.6762 3.46268 17.8731 2.33594 14 2.33594Z" stroke="#163B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="stat-value">{userStats.rank}</div>
              <div className="stat-label">Rank</div>
            </div>

            <div className="nautical-stat-card">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2.33594C7.55538 2.33594 2.33203 7.55928 2.33203 14.0026C2.33203 20.4459 7.55538 25.6693 14 25.6693C20.4346 25.6693 25.6654 20.4459 25.6654 14.0026C25.6654 7.55928 20.4346 2.33594 14 2.33594Z" stroke="#163B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.668 10.5026H16.332M14 10.5026V17.5026M9.33464 14.0026H18.6654" stroke="#163B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="stat-value">{userStats.totalScore}</div>
              <div className="stat-label">Score</div>
            </div>
          </div>

        </div>
      </main>

      <footer className="nautical-footer">
        <div className="footer-divider"></div>
        <div className="nautical-footer-nav">
          <button className="nav-btn nav-btn-active">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 9.34375V12.8372" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 1.83594V4.58594" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.4154 11.9193V6.41927C17.4154 5.93304 17.2222 5.46673 16.8784 5.12291C16.5346 4.77909 16.0683 4.58594 15.582 4.58594H6.41536C5.92913 4.58594 5.46282 4.77909 5.119 5.12291C4.77519 5.46673 4.58203 5.93304 4.58203 6.41927V11.9193" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.7664 18.3296C18.7525 16.6654 19.2659 14.7639 19.2514 12.8296L11.7457 9.49384C11.5114 9.38973 11.2578 9.33594 11.0014 9.33594C10.745 9.33594 10.4914 9.38973 10.2571 9.49384L2.75141 12.8296C2.70898 15.4363 3.62565 17.9678 5.32724 19.9429" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.83203 19.2526C2.38203 19.7109 2.93203 20.1693 4.1237 20.1693C6.41536 20.1693 6.41536 18.3359 8.70703 18.3359C9.8987 18.3359 10.4487 18.7943 10.9987 19.2526C11.5487 19.7109 12.0987 20.1693 13.2904 20.1693C15.582 20.1693 15.582 18.3359 17.8737 18.3359C19.0654 18.3359 19.6154 18.7943 20.1654 19.2526" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Voyage</span>
          </button>
          <button className="nav-btn" onClick={() => navigate('/leaderboard')}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16797 13.4375V14.928C9.16451 15.2421 9.08041 15.55 8.92375 15.8222C8.76709 16.0945 8.54311 16.3219 8.2733 16.4827C7.70052 16.9069 7.23457 17.4589 6.9125 18.0948C6.59042 18.7307 6.42109 19.4329 6.41797 20.1457" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.832 13.4375V14.928C12.8355 15.2421 12.9196 15.55 13.0762 15.8222C13.2329 16.0945 13.4569 16.3219 13.7267 16.4827C14.2995 16.9069 14.7654 17.4589 15.0875 18.0948C15.4096 18.7307 15.5789 19.4329 15.582 20.1457" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 8.2474H17.875C18.4828 8.2474 19.0657 8.00595 19.4955 7.57618C19.9252 7.14641 20.1667 6.56352 20.1667 5.95573C20.1667 5.34794 19.9252 4.76505 19.4955 4.33528C19.0657 3.90551 18.4828 3.66406 17.875 3.66406H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.66797 20.1641H18.3346" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 8.2526C5.5 9.7113 6.07946 11.1102 7.11091 12.1417C8.14236 13.1731 9.54131 13.7526 11 13.7526C12.4587 13.7526 13.8576 13.1731 14.8891 12.1417C15.9205 11.1102 16.5 9.7113 16.5 8.2526V2.7526C16.5 2.50949 16.4034 2.27633 16.2315 2.10442C16.0596 1.93251 15.8264 1.83594 15.5833 1.83594H6.41667C6.17355 1.83594 5.94039 1.93251 5.76849 2.10442C5.59658 2.27633 5.5 2.50949 5.5 2.7526V8.2526Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.4987 8.2474H4.1237C3.51591 8.2474 2.93302 8.00595 2.50324 7.57618C2.07347 7.14641 1.83203 6.56352 1.83203 5.95573C1.83203 5.34794 2.07347 4.76505 2.50324 4.33528C2.93302 3.90551 3.51591 3.66406 4.1237 3.66406H5.4987" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Ranks</span>
          </button>
          <button className="nav-btn" onClick={() => navigate('/about')}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="2"/>
              <path d="M11 7.5V11M11 14.5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>About</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Home;
