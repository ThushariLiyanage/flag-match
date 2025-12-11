import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiAnchor } from 'react-icons/fi';
import { GiWaveCrest } from 'react-icons/gi';
import api from '../api';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState({
    username: 'Loading...',
    email: 'Loading...',
    joinDate: '',
    crewName: '',
    rank: '',
    achievements: 0,
    voyages: 0,
  });

  const [editData, setEditData] = useState(userData);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/user/profile');
        setUserData(data);
        setEditData(data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const handleEditToggle = async () => {
    if (isEditMode) {
      try {
        const { data } = await api.put('/user/profile', editData);
        setUserData(data);
        setIsEditMode(false);
      } catch (err) {
        console.error('Failed to update profile', err);
      }
    } else {
      setEditData(userData);
      setIsEditMode(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-background">
        <div className="profile-bg-gradient"></div>
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/95fcb03ba37465ca39e626cc4bdadf43a19c8091?width=2816" 
          alt="" 
          className="profile-map-image"
        />
        <div className="profile-compass-decoration">
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

      <header className="profile-header">
        <div className="profile-header-content">
          <button className="profile-back-btn" onClick={() => navigate('/home')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#FCE8A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 10H16.6667" stroke="#FCE8A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="profile-back-label">Back to Port</span>
          </button>
          <div className="profile-header-title">
            <h1 className="profile-page-title">Captain's Profile</h1>
          </div>
          <div className="profile-header-spacer"></div>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-content-wrapper">
          <div className="profile-card">
            <div className="profile-corner profile-corner-tl"></div>
            <div className="profile-corner profile-corner-tr"></div>
            <div className="profile-corner profile-corner-bl"></div>
            <div className="profile-corner profile-corner-br"></div>

            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="40" fill="#D4AF37"/>
                  <path d="M40 36C43.866 36 47 32.866 47 29C47 25.134 43.866 22 40 22C36.134 22 33 25.134 33 29C33 32.866 36.134 36 40 36Z" fill="#0C1F2B"/>
                  <path d="M55 57C55 54 51 50 40 50C29 50 25 54 25 57V58H55V57Z" fill="#0C1F2B"/>
                </svg>
              </div>
              <div className="profile-avatar-text">
                <h2 className="profile-username">{isEditMode ? 'Edit Username' : userData.username}</h2>
                <p className="profile-rank">{isEditMode ? 'Edit Rank' : userData.rank}</p>
              </div>
            </div>

            <div className="profile-divider"></div>

            <div className="profile-section">
              <h3 className="profile-section-title">Personal Information</h3>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <label className="profile-label">Username</label>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      name="username"
                      value={editData.username}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <p className="profile-value">{userData.username}</p>
                  )}
                </div>
                <div className="profile-info-item">
                  <label className="profile-label">Email</label>
                  {isEditMode ? (
                    <input 
                      type="email" 
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <p className="profile-value">{userData.email}</p>
                  )}
                </div>
                <div className="profile-info-item">
                  <label className="profile-label">Join Date</label>
                  <p className="profile-value">{userData.joinDate}</p>
                </div>
                <div className="profile-info-item">
                  <label className="profile-label">Crew Name</label>
                  {isEditMode ? (
                    <input 
                      type="text" 
                      name="crewName"
                      value={editData.crewName}
                      onChange={handleInputChange}
                      className="profile-input"
                    />
                  ) : (
                    <p className="profile-value">{userData.crewName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-divider"></div>

            <div className="profile-actions">
              <button 
                className={`profile-action-btn ${isEditMode ? 'save-mode' : 'edit-mode'}`}
                onClick={handleEditToggle}
              >
                {isEditMode ? 'Save Changes' : 'Edit Profile'}
              </button>
              {isEditMode && (
                <button 
                  className="profile-action-btn cancel-mode"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditData(userData);
                  }}
                >
                  Cancel
                </button>
              )}
              <button 
                className="profile-action-btn logout-mode"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 14H2C1.73478 14 1.48043 13.8946 1.29289 13.7071C1.10536 13.5196 1 13.2652 1 13V3C1 2.73478 1.10536 2.48043 1.29289 2.29289C1.48043 2.10536 1.73478 2 2 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 11L15 7L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
