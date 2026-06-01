import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const navigate = useNavigate();

  // 1. Grab the VIP Pass from login
  const token = localStorage.getItem('token'); 
  const currentUser = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    // 2. Fetch directly from your MongoDB Backend!
    const fetchLikesFromDB = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/library/likes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` // Showing the Bouncer our pass
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLikedSongs(data); // Put the DB data into our React state
        } else {
          console.error("Failed to fetch likes");
        }
      } catch (error) {
        console.error("Server error:", error);
      }
    };

    if (token) {
      fetchLikesFromDB();
    }
  }, [token]);

  const removeSong = async (trackId) => {
    try {
      // 3. Tell the backend to delete it
      const response = await fetch(`http://localhost:5000/api/library/likes/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedSongs = await response.json();
        setLikedSongs(updatedSongs); // Update screen with the new DB array
      }
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  // ... The rest of your return() statement stays EXACTLY the same! ...

  return (
    <div className="app-container theme-default" style={{ display: 'block', paddingTop: '100px' }}>
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Moods
      </button>

      <div className="playlist-header">
        <h1>Your Liked Tracks</h1>
        <p>{likedSongs.length} songs saved to {currentUser}'s frequency.</p>
      </div>

      {likedSongs.length === 0 ? (
        <div className="loading-state">No songs liked yet. Explore moods to add some!</div>
      ) : (
        <div className="song-grid">
          {likedSongs.map((song) => (
            <div key={song.trackId} className="song-card">
              <img
                src={song.artworkUrl100.replace('100x100', '300x300')}
                alt="album art"
                className="song-artwork"
              />
              <div className="song-details">
                <h3 className="song-title">{song.trackName}</h3>
                <p className="song-artist">{song.artistName}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {song.previewUrl && (
                  <audio controls className="custom-audio">
                    <source src={song.previewUrl} type="audio/mp4" />
                  </audio>
                )}
                <button
                  className="auth-btn"
                  style={{ padding: '8px', fontSize: '0.7rem', background: '#ff4d4d', color: 'white' }}
                  onClick={() => removeSong(song.trackId)}
                >
                  REMOVE FROM LIKED
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedSongs;
