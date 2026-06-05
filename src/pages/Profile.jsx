import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const savedUsername = localStorage.getItem('username') || 'Unknown Operator';
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const [userProfile, setUserProfile] = useState({
    name: savedUsername,
    username: `@${savedUsername.toLowerCase().replace(/\s+/g, '_')}`,
    bio: "Capturing lo-fi frequencies and retro aesthetics. Signal active.",
    joinDate: "SYS.INIT: 2024",
    stats: {
      tapes: 0,
      likes: 0
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchUserData = async () => {
      try {
        const [playlistsRes, likesRes] = await Promise.all([
          fetch('http://localhost:5000/api/library/playlists', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/library/likes', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (playlistsRes.ok && likesRes.ok) {
          const playlists = await playlistsRes.json();
          const likes = await likesRes.json();

          setUserProfile(prev => ({
            ...prev,
            stats: { 
              tapes: playlists.length, 
              likes: likes.length 
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching profile stats:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="app-container theme-default" style={{ display: 'block', paddingTop: '100px', paddingBottom: '50px' }}>
      <div className="ambient-glow" style={{ '--theme-accent': '#8da9c4' }}></div>

      <button className="back-btn" onClick={() => navigate('/playlists')} style={{ position: 'relative', zIndex: 2 }}>
        ← Back to Library
      </button>

      <div className="profile-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        <div className="playlist-header">
          <h1 className="glowing-text" style={{ color: '#fff', '--theme-accent': '#8da9c4' }}>Operator ID</h1>
          <p>System credentials and broadcast statistics.</p>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <span>{getInitials(userProfile.name)}</span>
            </div>
            <div className="profile-identity">
              <h2>{userProfile.name}</h2>
              <span className="username-tag">{userProfile.username}</span>
            </div>
          </div>

          <div className="profile-bio">
            <p>{userProfile.bio}</p>
            <span className="join-date">{userProfile.joinDate}</span>
          </div>

          <div className="profile-stats-grid">
            <div className="stat-box">
              <span className="stat-value">{userProfile.stats.tapes}</span>
              <span className="stat-label">Mixtapes Formatted</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{userProfile.stats.likes}</span>
              <span className="stat-label">Frequencies Saved</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="theme-btn" style={{ '--theme-accent': '#fce8a1' }}>
              Configure ID
            </button>
            <button onClick={handleLogout} className="theme-btn destroy-btn">
              Terminate Session (Logout)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;