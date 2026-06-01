import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Playlists = () => {
  const navigate = useNavigate();
  const [customPlaylists, setCustomPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const currentUser = localStorage.getItem('username') || 'Guest';

  // --- CONNECTED TO BACKEND: Fetching Tapes ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchPlaylists = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/library/playlists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCustomPlaylists(data);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  const curatedCollections = [
    { id: 'happy', title: 'Solar Echoes', mood: 'Happy', color: '#f6eac2' },
    { id: 'sad', title: 'Midnight Rain', mood: 'Sad', color: '#8da9c4' },
    { id: 'angry', title: 'Static Noise', mood: 'Angry', color: '#ff8a8a' },
    { id: 'relaxed', title: 'Forest Drift', mood: 'Relaxed', color: '#a3c2a6' },
  ];

  // --- CONNECTED TO BACKEND: Creating a Tape ---
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const token = localStorage.getItem('token');
    const newPlaylist = {
      id: `custom-${Date.now()}`,
      title: newPlaylistName,
      mood: 'Custom Mix',
      color: '#d3d3d3',
      songs: []
    };

    try {
      const response = await fetch('http://localhost:5000/api/library/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPlaylist)
      });

      if (response.ok) {
        const updatedPlaylists = await response.json();
        setCustomPlaylists(updatedPlaylists); // Update UI with DB data
        setNewPlaylistName('');
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <div className="app-container theme-default" style={{ display: 'block', paddingTop: '100px', paddingBottom: '50px' }}>
      <div className="playlist-header">
        <h1>Your Library</h1>
        <p>Atmospheric frequencies saved to {currentUser}'s log.</p>
      </div>

      <h2 style={{ fontSize: '1.2rem', marginTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        System Curated
      </h2>
      <div className="tape-grid" style={{ marginBottom: '40px' }}>
        {curatedCollections.map((item) => (
          <div key={item.id} className="tape-item" onClick={() => navigate(`/${item.id}`)}>
            <div className="tape-case" style={{ borderColor: item.color }}>
              <div className="tape-label">
                <span className="tape-title">{item.title}</span>
                <span className="tape-mood">{item.mood}</span>
              </div>
              <div className="tape-reels">
                <div className="reel"></div>
                <div className="reel"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Personal Mixtapes</h2>
        <button 
          className="auth-btn" 
          style={{ width: 'auto', padding: '8px 15px', fontSize: '0.8rem' }}
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? 'CANCEL' : '+ BLANK TAPE'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreatePlaylist} style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Name your mixtape (e.g., Late Night Coding)..." 
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '4px', fontFamily: 'inherit' }}
            autoFocus
          />
          <button type="submit" className="auth-btn" style={{ width: 'auto', padding: '10px 20px' }}>CREATE</button>
        </form>
      )}

      <div className="tape-grid" style={{ marginTop: '20px' }}>
        {customPlaylists.length === 0 && !isCreating ? (
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>No custom mixtapes created yet. Insert a blank tape to begin.</p>
        ) : (
          customPlaylists.map((item) => (
            <div key={item.id} className="tape-item" onClick={() => navigate(`/playlist/${item.id}`)}>
              <div className="tape-case" style={{ borderColor: item.color }}>
                <div className="tape-label">
                  <span className="tape-title">{item.title}</span>
                  <span className="tape-mood">Tracks: {item.songs.length}</span>
                </div>
                <div className="tape-reels">
                  <div className="reel"></div>
                  <div className="reel"></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlists;