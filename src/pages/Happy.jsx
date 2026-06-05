import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveMood } from './moodStorage';
import '../App.css';

const Happy = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customPlaylists, setCustomPlaylists] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    saveMood('Happy');
    const fetchHappyPlaylist = async () => {
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=feel+good+upbeat+pop&entity=song&limit=50`);
        const data = await response.json();
        setSongs(data.results);
      } catch (error) {
        console.error("Error fetching happy playlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHappyPlaylist();
    const fetchUserPlaylists = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/library/playlists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCustomPlaylists(data);
        }
      } catch (error) {
        console.error("Error fetching playlists", error);
      }
    };
    fetchUserPlaylists();
  }, []);

  const handleLike = async (song) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please log in to save frequencies.");

    try {
      const response = await fetch('http://localhost:5000/api/library/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(song)
      });

      if (response.ok) {
        alert("Added to Liked Songs!");
      } else {
        const data = await response.json();
        alert(data.message); 
      }
    } catch (error) {
      console.error("Error saving song:", error);
    }
  };

  const handleAddToPlaylist = async (playlistId, song) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please log in first.");

    try {
      const response = await fetch(`http://localhost:5000/api/library/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(song)
      });

      if (response.ok) {
        alert(`Track added to mixtape!`);
        setOpenDropdownId(null);
      } else {
        const data = await response.json();
        alert(data.message); 
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
    }
  };

  return (
    <div className="app-container theme-happy" style={{ display: 'block', paddingTop: '100px', paddingBottom: '50px' }}>
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Moods</button>
      <div className="playlist-header">
        <h1>☀️ Happy Frequency</h1>
        <p>Curated upbeat tracks to lift the mood</p>
      </div>

      {isLoading ? (
        <div className="loading-state">Syncing tracks...</div>
      ) : (
        <div className="song-grid">
          {songs.map((song) => (
            <div key={song.trackId} className="song-card" style={{ position: 'relative' }}>
              <img src={song.artworkUrl100.replace('100x100', '300x300')} alt="album art" className="song-artwork" />
              <div className="song-details">
                <h3 className="song-title">{song.trackName}</h3>
                <p className="song-artist">{song.artistName}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                {song.previewUrl && (
                  <audio controls className="custom-audio" style={{ flex: 1 }}>
                    <source src={song.previewUrl} type="audio/mp4" />
                  </audio>
                )}

                <button onClick={() => handleLike(song)} className="icon-btn heart-btn" title="Add to Liked Songs">♥</button>

                <div style={{ position: 'relative' }}>
                  <button onClick={() => setOpenDropdownId(openDropdownId === song.trackId ? null : song.trackId)} className="icon-btn add-btn" title="Add to Mixtape">+</button>

                  {openDropdownId === song.trackId && (
                    <div className="playlist-dropdown">
                      <div className="dropdown-header">ADD TO TAPE:</div>
                      {customPlaylists.length === 0 ? (
                        <div className="dropdown-item" style={{ opacity: 0.5, cursor: 'default' }}>No tapes available</div>
                      ) : (
                        customPlaylists.map(pl => (
                          <div key={pl.id} className="dropdown-item" onClick={() => handleAddToPlaylist(pl.id, song)}>
                            {pl.title}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Happy;