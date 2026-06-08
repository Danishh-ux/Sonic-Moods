import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const savedUsername = sessionStorage.getItem('username') || 'Unknown Operator';
  
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
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
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  const handleEditClick = () => {
    setEditForm({ name: userProfile.name, bio: userProfile.bio });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {    
    setUserProfile(prev => ({
      ...prev,
      name: editForm.name,
      username: `@${editForm.name.toLowerCase().replace(/\s+/g, '_')}`,
      bio: editForm.bio
    }));

    sessionStorage.setItem('username', editForm.name);
    
    setIsEditing(false);
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
          {isEditing ? (
            <div className="profile-edit-mode" style={{ padding: '20px 0' }}>
              <div className="input-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', opacity: 0.7, fontSize: '0.8rem' }}>Operator Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ 
                    width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', 
                    border: '1px solid #8da9c4', color: 'white', borderRadius: '4px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div className="input-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', opacity: 0.7, fontSize: '0.8rem' }}>Broadcast Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  style={{ 
                    width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', 
                    border: '1px solid #8da9c4', color: 'white', borderRadius: '4px',
                    minHeight: '80px', fontFamily: 'inherit', resize: 'vertical'
                  }}
                />
              </div>

              <div className="profile-actions">
                <button onClick={handleSaveProfile} className="theme-btn" style={{ '--theme-accent': '#a3c2a6' }}>
                  Save Configuration
                </button>
                <button onClick={() => setIsEditing(false)} className="back-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
          
            <>
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
                <button onClick={handleEditClick} className="theme-btn" style={{ '--theme-accent': '#fce8a1' }}>
                  Configure ID
                </button>
                <button onClick={handleLogout} className="theme-btn destroy-btn">
                  Terminate Session (Logout)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;