import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinCrew.css';
import OTPVerification from './OTPVerification';
import api from '../api';

function JoinCrew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const validatePasswordStrength = (password) => {
    const strength = {
      score: 0,
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)
    };

    let score = 0;
    if (strength.hasMinLength) score++;
    if (strength.hasUppercase) score++;
    if (strength.hasLowercase) score++;
    if (strength.hasNumber) score++;
    if (strength.hasSpecialChar) score++;

    strength.score = score;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(validatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (formData.password && passwordStrength.score < 5) {
      newErrors.password = 'Password must include uppercase, lowercase, number, special character, and be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      const { username, email, password } = formData;
      const payload = { username, email, password };
      const res = await api.post('/auth/register', payload);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      } else if (res.data.requiresOTP) {
        // OTP is required
        setUserEmail(email);
        setRequiresOTP(true);
      }
    } catch (err) {
      setErrors({ api: err.response?.data?.msg || err.response?.data?.error || 'Registration failed' });
    }
  };

  const handleOTPSuccess = (user) => {
    navigate('/home');
  };

   const handleBackToRegistration = () => {
    setRequiresOTP(false);
    setUserEmail('');
  };

  if (requiresOTP) {
    return (
      <OTPVerification 
        email={userEmail} 
        onSuccess={handleOTPSuccess}
        onBack={handleBackToRegistration}

      />
    );
  }

  return (
    <div className="join-crew-container">
      <div className="join-crew-background">
        <div className="join-crew-bg-gradient"></div>
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/95fcb03ba37465ca39e626cc4bdadf43a19c8091?width=2816"
          alt=""
          className="join-crew-map-image"
        />
        <div className="join-crew-compass-decoration">
          <svg width="360" height="360" viewBox="0 0 349 361" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M180.115 342.215C269.642 342.215 342.218 269.638 342.218 180.111C342.218 90.584 269.642 18.0078 180.115 18.0078C90.5879 18.0078 18.0117 90.584 18.0117 180.111C18.0117 269.638 90.5879 342.215 180.115 342.215Z" stroke="#D4AF37"/>
            <path d="M180.116 306.192C249.748 306.192 306.196 249.744 306.196 180.112C306.196 110.479 249.748 54.0312 180.116 54.0312C110.483 54.0312 54.0352 110.479 54.0352 180.112C54.0352 249.744 110.483 306.192 180.116 306.192Z" stroke="#D4AF37"/>
            <path d="M197.597 161.919L180.112 179.403L162.628 161.919L180.112 22.0391L197.597 161.919Z" fill="black" stroke="#D4AF37"/>
            <path opacity="0.7" d="M338.185 180.112L198.305 197.597L180.82 180.112L198.305 162.628L338.185 180.112Z" fill="black" stroke="#D4AF37"/>
            <path opacity="0.5" d="M197.597 198.309L180.112 338.188L162.628 198.309L180.112 180.824L197.597 198.309Z" fill="black" stroke="#D4AF37"/>
            <path opacity="0.6" d="M179.407 180.112L161.923 197.597L22.043 180.112L161.923 162.628L179.407 180.112Z" fill="black" stroke="#D4AF37"/>
          </svg>
        </div>
      </div>

      <header className="join-crew-header">
        <div className="join-crew-header-content">
          <button className="back-btn" onClick={() => navigate('/login')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#FCE8A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 10H16.6667" stroke="#FCE8A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="back-label">Back to Port</span>
          </button>
          <h1 className="join-crew-header-title">Create Account</h1>
          <div className="join-crew-header-spacer"></div>
        </div>
      </header>

      <main className="join-crew-main">
        <div className="join-crew-content-wrapper">
          <div className="join-crew-modal">
            <div className="join-crew-corner join-crew-corner-tl"></div>
            <div className="join-crew-corner join-crew-corner-tr"></div>
            <div className="join-crew-corner join-crew-corner-bl"></div>
            <div className="join-crew-corner join-crew-corner-br"></div>

            <h2 className="register-title">Sign Up</h2>
            <p className="register-subtitle">Begin your voyage of discovery</p>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="register-form-group">
                <label className="register-form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`register-form-input ${errors.username ? 'error' : ''}`}
                />
                {errors.username && <span className="register-error">{errors.username}</span>}
              </div>

              <div className="register-form-group">
                <label className="register-form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`register-form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="register-error">{errors.email}</span>}
              </div>

              <div className="register-form-group">
                <label className="register-form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`register-form-input ${errors.password ? 'error' : ''}`}
                />
                {formData.password && (
                  <div className="password-strength-container">
                    <div className="password-strength-bar">
                      <div
                        className={`password-strength-fill strength-${passwordStrength.score}`}
                      ></div>
                    </div>
                    <div className="password-requirements">
                      <div className={`requirement ${passwordStrength.hasMinLength ? 'met' : ''}`}>
                        <span className="requirement-dot">●</span> At least 8 characters
                      </div>
                      <div className={`requirement ${passwordStrength.hasUppercase ? 'met' : ''}`}>
                        <span className="requirement-dot">●</span> Uppercase letter
                      </div>
                      <div className={`requirement ${passwordStrength.hasLowercase ? 'met' : ''}`}>
                        <span className="requirement-dot">●</span> Lowercase letter
                      </div>
                      <div className={`requirement ${passwordStrength.hasNumber ? 'met' : ''}`}>
                        <span className="requirement-dot">●</span> Number
                      </div>
                      <div className={`requirement ${passwordStrength.hasSpecialChar ? 'met' : ''}`}>
                        <span className="requirement-dot">●</span> Special character
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && <span className="register-error">{errors.password}</span>}
              </div>

              <div className="register-form-group">
                <label className="register-form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`register-form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && <span className="register-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="register-submit-btn">
                Set Sail
              </button>
            </form>

            <p className="register-login-text">
              Already have an account? <button className="register-login-link" onClick={() => navigate('/login')}>Sign In</button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JoinCrew;
