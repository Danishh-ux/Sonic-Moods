import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);

  // --- CONNECTED TO BACKEND ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchSpecificPlaylist = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/library/playlists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const allPlaylists = await response.json();
          const foundPlaylist = allPlaylists.find(pl => pl.id === id);
          setPlaylist(foundPlaylist);
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchSpecificPlaylist();
  }, [id, navigate]);

  const handleRemoveSong = async (trackId) => {
    const token = localStorage.getItem('token');
    try {
      // Calls the DELETE route for this specific track inside this specific playlist
      const response = await fetch(`http://localhost:5000/api/library/playlists/${id}/songs/${trackId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const updatedPlaylist = await response.json();
        setPlaylist(updatedPlaylist);
      }
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  if (!playlist) {
    return (
      <div className="app-container theme-default" style={{ paddingTop: '100px', textAlign: 'center' }}>
        <h2 style={{ color: 'white' }}>Tape Not Found</h2>
        <button className="back-btn" onClick={() => navigate('/playlists')}>Return to Library</button>
      </div>
    );
  }

  return (
    <div className="app-container theme-default" style={{ display: 'block', paddingTop: '100px', paddingBottom: '50px' }}>
      <button className="back-btn" onClick={() => navigate('/playlists')}>
        ← Back to Library
      </button>

      <div className="playlist-header" style={{ borderBottom: `2px solid ${playlist.color || '#d3d3d3'}`, paddingBottom: '20px' }}>
        <h1 style={{ color: '#fff' }}>{playlist.title}</h1>
        <p>Custom Mixtape • {playlist.songs.length} tracks</p>
      </div>

      {playlist.songs.length === 0 ? (
        <div className="loading-state">
          <p>This tape is completely blank.</p>
          <button className="auth-btn" style={{ marginTop: '20px', width: 'auto' }} onClick={() => navigate('/')}>
            BROWSE FREQUENCIES
          </button>
        </div>
      ) : (
        <div className="song-grid" style={{ marginTop: '30px' }}>
          {playlist.songs.map((song) => (
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                {song.previewUrl && (
                  <audio controls className="custom-audio" style={{ flex: 1 }}>
                    <source src={song.previewUrl} type="audio/mp4" />
                  </audio>
                )}

                <button
                  onClick={() => handleRemoveSong(song.trackId)}
                  style={{
                    background: 'none', border: 'none', color: '#ff8a8a',
                    fontSize: '1.2rem', cursor: 'pointer', padding: '0 5px',
                    transition: 'transform 0.2s ease, opacity 0.2s ease'
                  }}
                  title="Remove from tape"
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistView;