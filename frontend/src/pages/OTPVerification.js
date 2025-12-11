import React, { useState, useRef, useEffect } from 'react';
import './OTPVerification.css';
import api from '../api';

function OTPVerification({ email, onSuccess, onResend, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', { email, code });
      if (res.data.user) {
        // Cookie is already set, redirect to home
        onSuccess(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      setResendTimer(30);
      setError('');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend OTP');
    }
  };

  return (
    <div className="otp-verification-page">
      <div className="otp-verification-background">
        <div className="otp-verification-bg-gradient"></div>
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/95fcb03ba37465ca39e626cc4bdadf43a19c8091?width=2816"
          alt=""
          className="otp-verification-map-image"
        />
      </div>

      <div className="otp-verification-container">
        <div className="otp-verification-modal">
          <div className="otp-verification-corner otp-verification-corner-tl"></div>
          <div className="otp-verification-corner otp-verification-corner-tr"></div>
          <div className="otp-verification-corner otp-verification-corner-bl"></div>
          <div className="otp-verification-corner otp-verification-corner-br"></div>

          <h2 className="otp-verification-title">Verify Your Identity</h2>
          <p className="otp-verification-subtitle">Enter the 6-digit code sent to {email}</p>

          <form className="otp-verification-form" onSubmit={handleSubmit}>
            <div className="otp-verification-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-verification-input"
                  placeholder="0"
                  disabled={loading}
                />
              ))}
            </div>

            {error && <div className="otp-verification-error">{error}</div>}

            <button
              type="submit"
              className="otp-verification-btn"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              className="otp-verification-back-btn"
              onClick={onBack}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>

          <div className="otp-verification-footer">
            <p className="otp-verification-text">Didn't receive a code?</p>
            <button
              type="button"
              className="otp-verification-resend"
              onClick={handleResend}
              disabled={resendTimer > 0 || loading}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </button>
          </div>

          <div className="otp-verification-security">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5V12C3 16.5 6.4 20.7 12 23C17.6 20.7 21 16.5 21 12V5L12 1Z" stroke="#8A7023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Secured by the Royal Navy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
