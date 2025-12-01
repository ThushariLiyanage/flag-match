import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Leaderboard.css';

function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/leaderboard');
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard', err);
      }
    };
    fetchLeaderboard();
  }, []);

  if (leaderboard.length === 0) {
    return <div>No any user registered yet!</div>;
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfList = leaderboard.slice(3);
  // const topThree = LEADERBOARD_DATA.slice(0, 3);
  // const restOfList = LEADERBOARD_DATA.slice(3);

  const formatPoints = (player) => player?.points?.toLocaleString() || '0';

  return (
    <div className="nautical-leaderboard-container">
      <div className="nautical-leaderboard-background">
        <div className="nautical-leaderboard-bg-gradient"></div>
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/380c75b1b49b0c61873b11ae54dc4ee09b3f17b6?width=2816"
          alt=""
          className="nautical-leaderboard-map-image"
        />
        <div className="nautical-leaderboard-compass">
          <svg width="328" height="328" viewBox="0 0 329 329" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M164.231 312.04C245.864 312.04 312.04 245.864 312.04 164.231C312.04 82.5983 245.864 16.4219 164.231 16.4219C82.5983 16.4219 16.4219 82.5983 16.4219 164.231C16.4219 245.864 82.5983 312.04 164.231 312.04Z" stroke="#D4AF37" />
            <path d="M164.232 279.199C227.724 279.199 279.195 227.728 279.195 164.236C279.195 100.744 227.724 49.2734 164.232 49.2734C100.74 49.2734 49.2695 100.744 49.2695 164.236C49.2695 227.728 100.74 279.199 164.232 279.199Z" stroke="#D4AF37" />
            <path d="M180.128 147.627L164.231 163.523L148.335 147.627L164.231 20.4521L180.128 147.627Z" fill="black" stroke="#D4AF37" />
            <path opacity="0.7" d="M308.013 164.235L180.838 180.132L164.94 164.235L180.838 148.338L308.013 164.235Z" fill="black" stroke="#D4AF37" />
            <path opacity="0.5" d="M180.128 180.838L164.231 308.013L148.334 180.838L164.231 164.94L180.128 180.838Z" fill="black" stroke="#D4AF37" />
            <path opacity="0.6" d="M163.523 164.235L147.627 180.132L20.4521 164.235L147.627 148.339L163.523 164.235Z" fill="black" stroke="#D4AF37" />
          </svg>
        </div>
        <div className="nautical-leaderboard-ship">
          <svg width="127" height="127" viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M63.3008 53.75V73.8527" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M63.3008 10.5469V26.3716" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M100.224 68.5743V36.9248C100.224 34.1268 99.1123 31.4434 97.1338 29.465C95.1553 27.4865 92.4719 26.375 89.674 26.375H36.9248C34.1268 26.375 31.4434 27.4865 29.465 29.465C27.4865 31.4434 26.375 34.1268 26.375 36.9248V68.5743" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M102.228 105.496C107.902 95.9195 110.856 84.9769 110.773 73.8462L67.582 54.6508C66.2335 54.0517 64.7743 53.7422 63.2987 53.7422C61.8232 53.7422 60.364 54.0517 59.0155 54.6508L15.8245 73.8462C15.5803 88.8464 20.8553 103.414 30.647 114.78" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.5508 110.775C13.7157 113.412 16.8807 116.05 23.7381 116.05C36.9253 116.05 36.9253 105.5 50.1126 105.5C56.97 105.5 60.135 108.137 63.2999 110.775C66.4649 113.412 69.6298 116.05 76.4872 116.05C89.6745 116.05 89.6745 105.5 102.862 105.5C109.719 105.5 112.884 108.137 116.049 110.775" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <header className="nautical-leaderboard-header">
        <div className="nautical-leaderboard-header-content">
          <button className="return-btn" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#F7EFDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Return</span>
          </button>
          <h1 className="hall-of-fame-title">Hall of Fame</h1>
        </div>
      </header>

      <main className="nautical-leaderboard-main">
        <div className="nautical-leaderboard-content">
          <div className="podium-card">
            <div className="podium-corner podium-corner-tl"></div>
            <div className="podium-corner podium-corner-tr"></div>
            <div className="podium-corner podium-corner-bl"></div>
            <div className="podium-corner podium-corner-br"></div>

            <div className="podium-players">

              {/* --- SECOND PLACE (Left) --- */}
              <div className="podium-player podium-second">
                {topThree[1] ? (
                  <>
                    <div className="podium-avatar podium-avatar-second">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* ... keep your existing Second Place SVG path here ... */}
                        <path d="M15.3665 3.05725C15.4249..." stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="podium-badge-icon">
                      <path d="M16 29.3307V10.6641" stroke="#D4C1A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6.66797 16H2.66797C..." stroke="#D4C1A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 10.6641C18.2091..." stroke="#D4C1A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="podium-name">{topThree[1].name}</div>
                    <div className="podium-points">{formatPoints(topThree[1])}</div>
                    <div className="podium-bar podium-bar-second"></div>
                  </>
                ) : (
                  /* Placeholder for empty slot */
                  <div className="podium-empty" style={{ height: '100%', opacity: 0.3 }}>Available</div>
                )}
              </div>

              {/* --- FIRST PLACE (Center) --- */}
              <div className="podium-player podium-first">
                {topThree[0] ? (
                  <>
                    <div className="podium-avatar podium-avatar-first">
                      <div className="podium-glow"></div>
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* ... keep your existing First Place SVG path here ... */}
                        <path d="M19.2684 5.44703C..." stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.33203 35H31.6654" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="podium-badge-icon">
                      <path d="M19.2684 5.44703C..." stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8.33203 35H31.6654" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="podium-name">{topThree[0].name}</div>
                    <div className="podium-points">{formatPoints(topThree[0])}</div>
                    <div className="podium-bar podium-bar-first"></div>
                  </>
                ) : (
                  <div className="podium-empty">Available</div>
                )}
              </div>

              {/* --- THIRD PLACE (Right) --- */}
              <div className="podium-player podium-third">
                {topThree[2] ? (
                  <>
                    <div className="podium-avatar podium-avatar-third">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* ... keep your existing Third Place SVG path here ... */}
                        <path d="M16.0013 29.3307C..." stroke="#FBF7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.0013 2.66406C..." stroke="#FBF7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2.66797 16H29.3346" stroke="#FBF7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="podium-badge-icon">
                      <path d="M21.6543 10.3438L..." stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16.0013 29.3307C..." stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="podium-name">{topThree[2].name}</div>
                    <div className="podium-points">{formatPoints(topThree[2])}</div>
                    <div className="podium-bar podium-bar-third"></div>
                  </>
                ) : (
                  <div className="podium-empty" style={{ height: '100%', opacity: 0.3 }}>Available</div>
                )}
              </div>

            </div>
          </div>

          <div className="rank-list">
            {restOfList.map((player) => (
              <div
                key={player.rank}
                className={`rank-item ${player.isCurrentUser ? 'rank-item-current' : ''}`}
              >
                {player.isCurrentUser && <div className="current-user-overlay"></div>}
                <div className="rank-number">
                  {player.rank}
                </div>
                <div className="rank-icon">
                  {player.rank === 4 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 14.6562V16.2822C9.99622 16.6249 9.90448 16.9608 9.73358 17.2578C9.56268 17.5547 9.31834 17.8028 9.024 17.9783C8.39914 18.4411 7.89084 19.0432 7.53948 19.7369C7.18813 20.4306 7.00341 21.1967 7 21.9743" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 14.6562V16.2822C14.0038 16.6249 14.0955 16.9608 14.2664 17.2578C14.4373 17.5547 14.6817 17.8028 14.976 17.9783C15.6009 18.4411 16.1092 19.0432 16.4605 19.7369C16.8119 20.4306 16.9966 21.1967 17 21.9743" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18 9H19.5C20.163 9 20.7989 8.73661 21.2678 8.26777C21.7366 7.79893 22 7.16304 22 6.5C22 5.83696 21.7366 5.20107 21.2678 4.73223C20.7989 4.26339 20.163 4 19.5 4H18" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 22H20" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9V3C18 2.73478 17.8946 2.48043 17.7071 2.29289C17.5196 2.10536 17.2652 2 17 2H7C6.73478 2 6.48043 2.10536 6.29289 2.29289C6.10536 2.48043 6 2.73478 6 3V9Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 9H4.5C3.83696 9 3.20107 8.73661 2.73223 8.26777C2.26339 7.79893 2 7.16304 2 6.5C2 5.83696 2.26339 5.20107 2.73223 4.73223C3.20107 4.26339 3.83696 4 4.5 4H6" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {player.rank === 5 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {player.rank === 6 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.2417 7.75781L14.4377 13.1688C14.3395 13.4634 14.1741 13.7311 13.9545 13.9506C13.735 14.1702 13.4673 14.3356 13.1727 14.4338L7.76172 16.2378L9.56572 10.8268C9.6639 10.5322 9.82933 10.2646 10.0489 10.045C10.2685 9.82542 10.5361 9.66 10.8307 9.56181L16.2417 7.75781Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {player.rank === 7 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.106 5.55131C14.3836 5.69002 14.6897 5.76224 15 5.76224C15.3103 5.76224 15.6164 5.69002 15.894 5.55131L19.553 3.72131C19.7056 3.64507 19.8751 3.60912 20.0455 3.61688C20.2159 3.62463 20.3814 3.67585 20.5265 3.76564C20.6715 3.85543 20.7911 3.98082 20.874 4.12989C20.9569 4.27896 21.0003 4.44675 21 4.61731V17.3813C20.9999 17.567 20.9481 17.7489 20.8505 17.9068C20.7528 18.0647 20.6131 18.1923 20.447 18.2753L15.894 20.5523C15.6164 20.691 15.3103 20.7632 15 20.7632C14.6897 20.7632 14.3836 20.691 14.106 20.5523L9.894 18.4463C9.6164 18.3076 9.31033 18.2354 9 18.2354C8.68967 18.2354 8.3836 18.3076 8.106 18.4463L4.447 20.2763C4.29436 20.3526 4.12473 20.3885 3.95426 20.3807C3.78379 20.3729 3.61816 20.3216 3.47312 20.2317C3.32808 20.1418 3.20846 20.0163 3.12565 19.8671C3.04284 19.7179 2.99958 19.55 3 19.3793V6.61631C3.0001 6.43065 3.05189 6.24868 3.14956 6.09078C3.24722 5.93289 3.38692 5.8053 3.553 5.72231L8.106 3.44531C8.3836 3.30659 8.68967 3.23438 9 3.23438C9.31033 3.23438 9.6164 3.30659 9.894 3.44531L14.106 5.55131Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 5.76562V20.7656" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 3.23438V18.2344" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {player.rank === 8 && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 9H9.01" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 9H15.01" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="rank-info">
                  <div className="rank-name-row">
                    <span className="rank-name">{player.name}</span>
                    {player.country && <span className="rank-country">{player.country}</span>}
                    {player.isCurrentUser && <span className="you-badge">You</span>}
                  </div>
                  <div className="rank-points">{player.points.toLocaleString()} glory points</div>
                </div>
                {player.change !== null && (
                  <div className={`rank-change ${player.change > 0 ? 'rank-change-up' : player.change < 0 ? 'rank-change-down' : 'rank-change-neutral'}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_change)">
                        <path d="M9.33203 4.08594H12.832V7.58594" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.8346 4.08594L7.8763 9.04427L4.95964 6.1276L1.16797 9.91927" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip0_change">
                          <rect width="14" height="14" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>{player.change > 0 ? `+${player.change}` : player.change}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Leaderboard;
