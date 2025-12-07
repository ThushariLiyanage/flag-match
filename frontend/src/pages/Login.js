import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import OTPVerification from './OTPVerification';
import api from '../api';

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleTabChange = (tab) => {
    if (tab === 'joincrew') {
      navigate('/join-crew');
    } else {
      setActiveTab(tab);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      } else if (res.data.requiresOTP) {
        // OTP is required
        setUserEmail(email);
        setRequiresOTP(true);
      }
    } catch (err) {
      setLoginError(err.response?.data?.msg || 'Login failed. Please try again.');
      console.error('Login failed:', err.response?.data || err.message);
    }
  };

  const handleOTPSuccess = (user) => {
    navigate('/home');
  };

   const handleBackToLogin = () => {
    setRequiresOTP(false);
    setUserEmail('');
    setEmail('');
    setPassword('');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  if (requiresOTP) {
    return (
      <OTPVerification 
        email={userEmail} 
        onSuccess={handleOTPSuccess}
        onBack={handleBackToLogin}

      />
    );
  }

  return (
    <div className="login-page">
      <div className="decorative-compass">
        <svg width="265" height="265" viewBox="0 0 265 265" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M132.28 251.333C198.031 251.333 251.333 198.031 251.333 132.28C251.333 66.5285 198.031 13.2266 132.28 13.2266C66.5285 13.2266 13.2266 66.5285 13.2266 132.28C13.2266 198.031 66.5285 251.333 132.28 251.333Z" stroke="#D4AF37"/>
          <path d="M132.281 224.881C183.42 224.881 224.878 183.424 224.878 132.284C224.878 81.1446 183.42 39.6875 132.281 39.6875C81.1407 39.6875 39.6836 81.1446 39.6836 132.284C39.6836 183.424 81.1407 224.881 132.281 224.881Z" stroke="#D4AF37"/>
          <path d="M144.984 118.87L132.282 131.572L119.581 118.87L132.282 17.2578L144.984 118.87Z" fill="black" stroke="#D4AF37"/>
          <path opacity="0.7" d="M247.303 132.282L145.689 144.983L132.988 132.282L145.689 119.581L247.303 132.282Z" fill="black" stroke="#D4AF37"/>
          <path opacity="0.5" d="M144.983 145.689L132.282 247.303L119.581 145.689L132.282 132.988L144.983 145.689Z" fill="black" stroke="#D4AF37"/>
          <path opacity="0.6" d="M131.572 132.282L118.87 144.984L17.2578 132.282L118.87 119.581L131.572 132.282Z" fill="black" stroke="#D4AF37"/>
        </svg>
      </div>

      <div className="decorative-compass-small">
        <svg width="198" height="198" viewBox="0 0 198 198" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M133.799 63.9297L118.936 108.51C118.127 110.937 116.764 113.142 114.955 114.951C113.146 116.76 110.941 118.123 108.514 118.932L63.9336 133.795L78.7964 89.2147C79.6054 86.7876 80.9683 84.5823 82.7772 82.7733C84.5862 80.9644 86.7915 79.6014 89.2186 78.7925L133.799 63.9297Z" stroke="#C9A959" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M98.8649 181.253C144.367 181.253 181.253 144.367 181.253 98.8649C181.253 53.3631 144.367 16.4766 98.8649 16.4766C53.3631 16.4766 16.4766 53.3631 16.4766 98.8649C16.4766 144.367 53.3631 181.253 98.8649 181.253Z" stroke="#C9A959" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="content-wrapper">
        <div className="features-section">
          <button className="back-btn" onClick={handleBackToHome}>
            <span className="back-arrow">←</span>
            <span>Return to Port</span>
          </button>

          <div className="anchor-logo">
            <svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M57.9219 49.1797V67.5749" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M57.9219 9.65625V24.1369" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M91.709 62.7478V33.7866C91.709 31.2262 90.692 28.7708 88.8815 26.9603C87.0711 25.1499 84.6156 24.1328 82.0553 24.1328H33.7866C31.2262 24.1328 28.7708 25.1499 26.9603 26.9603C25.1499 28.7708 24.1328 31.2262 24.1328 33.7866V62.7478" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M93.5443 96.5374C98.7364 87.7746 101.44 77.7614 101.364 67.5761L61.8414 50.0111C60.6074 49.4629 59.2722 49.1797 57.9219 49.1797C56.5717 49.1797 55.2365 49.4629 54.0025 50.0111L14.4801 67.5761C14.2566 81.3022 19.0836 94.6321 28.0436 105.033" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.65234 101.366C12.5485 103.779 15.4446 106.193 21.7195 106.193C33.7867 106.193 33.7867 96.5391 45.8539 96.5391C52.1288 96.5391 55.025 98.9525 57.9211 101.366C60.8172 103.779 63.7133 106.193 69.9883 106.193C82.0554 106.193 82.0554 96.5391 94.1226 96.5391C100.398 96.5391 103.294 98.9525 106.19 101.366" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="branding">
            <h1 className="main-title">Flag Match</h1>
            <p className="main-subtitle">Begin your voyage of discovery across the seven seas</p>
          </div>

          <div className="features">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#071117" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Match & Learn</h3>
                <p className="feature-desc">Test your flag knowledge instantly</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Global Rankings</h3>
                <p className="feature-desc">Compete with explorers worldwide</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#071117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text">
                <h3 className="feature-title">Daily Challenges</h3>
                <p className="feature-desc">Earn rewards and unlock achievements</p>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-box">
            <div className="corner-decoration corner-tl"></div>
            <div className="corner-decoration corner-tr"></div>
            <div className="corner-decoration corner-bl"></div>
            <div className="corner-decoration corner-br"></div>

            <div className="tab-container">
              <div className="tab-highlight" style={{ left: activeTab === 'signin' ? '5px' : '193px' }}></div>
              <button
                className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
                onClick={() => handleTabChange('signin')}
              >
                Sign In
              </button>
              <button
                className={`tab ${activeTab === 'joincrew' ? 'active' : ''}`}
                onClick={() => handleTabChange('joincrew')}
              >
                Join Crew
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3346 5.83594L10.8421 10.6084C10.5879 10.7561 10.2991 10.8339 10.0051 10.8339C9.71102 10.8339 9.42222 10.7561 9.16797 10.6084L1.66797 5.83594" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.668 3.33594H3.33464C2.41416 3.33594 1.66797 4.08213 1.66797 5.0026V15.0026C1.66797 15.9231 2.41416 16.6693 3.33464 16.6693H16.668C17.5884 16.6693 18.3346 15.9231 18.3346 15.0026V5.0026C18.3346 4.08213 17.5884 3.33594 16.668 3.33594Z" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="email" className="auth-input" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.8333 9.16406H4.16667C3.24619 9.16406 2.5 9.91025 2.5 10.8307V16.6641C2.5 17.5845 3.24619 18.3307 4.16667 18.3307H15.8333C16.7538 18.3307 17.5 17.5845 17.5 16.6641V10.8307C17.5 9.91025 16.7538 9.16406 15.8333 9.16406Z" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.83203 9.16406V5.83073C5.83203 4.72566 6.27102 3.66585 7.05242 2.88445C7.83382 2.10305 8.89363 1.66406 9.9987 1.66406C11.1038 1.66406 12.1636 2.10305 12.945 2.88445C13.7264 3.66585 14.1654 4.72566 14.1654 5.83073V9.16406" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input type="password" className="auth-input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="toggle-password">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.72006 10.2869C1.65061 10.0998 1.65061 9.89398 1.72006 9.70688C2.39647 8.06676 3.54465 6.66442 5.01903 5.67763C6.49341 4.69085 8.22759 4.16406 10.0017 4.16406C11.7759 4.16406 13.51 4.69085 14.9844 5.67763C16.4588 6.66442 17.607 8.06676 18.2834 9.70688C18.3528 9.89398 18.3528 10.0998 18.2834 10.2869C17.607 11.927 16.4588 13.3293 14.9844 14.3161C13.51 15.3029 11.7759 15.8297 10.0017 15.8297C8.22759 15.8297 6.49341 15.3029 5.01903 14.3161C3.54465 13.3293 2.39647 11.927 1.72006 10.2869Z" stroke="#163B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#163B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {loginError && (
                <div className="auth-error">
                  {loginError}
                </div>
              )}

              <div className="form-extras">
                <label className="remember-me">
                  <div className="checkbox"></div>
                  <span>Remember me</span>
                </label>
                <button type="button" className="forgot-link">Forgot password?</button>
              </div>

              <button type="submit" className="sail-btn">
                <span>Set Sail</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 8.49219V11.668" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 1.66406V4.16406" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.8346 10.8307V5.83073C15.8346 5.3887 15.659 4.96478 15.3465 4.65222C15.0339 4.33966 14.61 4.16406 14.168 4.16406H5.83464C5.39261 4.16406 4.96868 4.33966 4.65612 4.65222C4.34356 4.96478 4.16797 5.3887 4.16797 5.83073V10.8307" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.1513 16.6682C17.0477 15.1554 17.5144 13.4267 17.5013 11.6682L10.6779 8.63573C10.4649 8.54109 10.2344 8.49219 10.0013 8.49219C9.76817 8.49219 9.53765 8.54109 9.32461 8.63573L2.50128 11.6682C2.46271 14.038 3.29605 16.3393 4.84295 18.1349" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.66797 17.4974C2.16797 17.9141 2.66797 18.3307 3.7513 18.3307C5.83464 18.3307 5.83464 16.6641 7.91797 16.6641C9.0013 16.6641 9.5013 17.0807 10.0013 17.4974C10.5013 17.9141 11.0013 18.3307 12.0846 18.3307C14.168 18.3307 14.168 16.6641 16.2513 16.6641C17.3346 16.6641 17.8346 17.0807 18.3346 17.4974" stroke="#0C1F2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>

          <div className="security-info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1093_16470)">
                <path d="M13.3346 8.66957C13.3346 12.0029 11.0013 13.6696 8.22797 14.6362C8.08274 14.6855 7.92499 14.6831 7.7813 14.6296C5.0013 13.6696 2.66797 12.0029 2.66797 8.66957V4.0029C2.66797 3.82609 2.73821 3.65652 2.86323 3.5315C2.98826 3.40648 3.15782 3.33624 3.33464 3.33624C4.66797 3.33624 6.33464 2.53624 7.49464 1.5229C7.63587 1.40224 7.81554 1.33594 8.0013 1.33594C8.18707 1.33594 8.36673 1.40224 8.50797 1.5229C9.67464 2.5429 11.3346 3.33624 12.668 3.33624C12.8448 3.33624 13.0143 3.40648 13.1394 3.5315C13.2644 3.65652 13.3346 3.82609 13.3346 4.0029V8.66957Z" stroke="#F3E7CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 7.9974L7.33333 9.33073L10 6.66406" stroke="#F3E7CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_1093_16470">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>Secured by the Royal Navy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
