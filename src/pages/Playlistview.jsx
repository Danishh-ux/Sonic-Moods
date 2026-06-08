import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#d3d3d3");

  useEffect(() => {
    // UPDATED to sessionStorage
    const token = sessionStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchSpecificPlaylist = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/library/playlists', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const allPlaylists = await response.json();
          const foundPlaylist = allPlaylists.find(pl => pl.id === id);
          if (foundPlaylist) {
            setPlaylist(foundPlaylist);
            setNewTitle(foundPlaylist.title);
            setNewColor(foundPlaylist.color || "#d3d3d3");
          }
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchSpecificPlaylist();
  }, [id, navigate]);

  const handleRemoveSong = async (trackId) => {
    const token = sessionStorage.getItem('token');
    try {
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

  const handlePatchTitle = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/library/playlists/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (response.ok) {
        const updatedPlaylist = await response.json();
        setPlaylist(updatedPlaylist);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error renaming playlist:", error);
    }
  };

  const handlePutReplace = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const fullUpdatedPlaylist = {
        ...playlist,
        title: newTitle,
        color: newColor
      };

      const response = await fetch(`http://localhost:5000/api/library/playlists/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(fullUpdatedPlaylist)
      });

      if (response.ok) {
        const allPlaylists = await response.json();
        const updatedPlaylist = allPlaylists.find(pl => pl.id === id);
        setPlaylist(updatedPlaylist);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error replacing playlist:", error);
    }
  };

  const handleDeletePlaylist = async () => {
    const confirmErase = window.confirm("CRITICAL WARNING: Are you sure you want to permanently erase this tape? This cannot be undone.");
    if (!confirmErase) return;

    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/library/playlists/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        navigate('/playlists');
      }
    } catch (error) {
      console.error("Error destroying tape:", error);
    }
  };

  if (!playlist) {
    return (
      <div className="app-container theme-default" style={{ paddingTop: '100px', textAlign: 'center' }}>
        <h2 style={{ color: 'white' }}>Tape Not Found</h2>
        <button className="back-btn" onClick={() => navigate('/playlists')}>
          Return to Library
        </button>
      </div>
    );
  }
  
  const activeColor = isEditing ? newColor : (playlist.color || "#d3d3d3");

  return (
    <div 
      className="app-container theme-default playlist-immersive-view" 
      style={{ 
        display: 'block', 
        paddingTop: '100px', 
        paddingBottom: '50px',
        '--theme-accent': activeColor 
      }}
    >
      <div className="ambient-glow"></div>

      <button className="back-btn" onClick={() => navigate('/playlists')} style={{ position: 'relative', zIndex: 2 }}>
        ← Back to Library
      </button>

      <div className="playlist-header" style={{ position: 'relative', zIndex: 2, borderBottom: `2px solid var(--theme-accent)`, paddingBottom: '20px' }}>
        {!isEditing ? (
          <>
            <h1 className="glowing-text" style={{ color: '#fff' }}>{playlist.title}</h1>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setNewTitle(playlist.title);
                  setNewColor(playlist.color || "#d3d3d3");
                }}
                className="back-btn edit-btn"
                style={{ fontSize: '0.8rem', margin: 0 }}
              >
                ✏️ Edit Tape Settings
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="back-btn destroy-btn"
                style={{ fontSize: '0.8rem', margin: 0 }}
              >
                🗑️ Destroy Tape
              </button>
            </div>
          </>
        ) : (
          <div className="playlist-edit-card" style={{ borderColor: 'var(--theme-accent)' }}>
            <div className="input-group">
              <label>Tape Name</label>
              <input
                type="text"
                className="edit-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter new tape name..."
                style={{ borderColor: 'var(--theme-accent)' }}
              />
            </div>

            <div className="input-group">
              <label>Tape Color Theme</label>
              <input
                type="color"
                className="color-picker-input"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{ boxShadow: `inset 0 2px 10px rgba(0,0,0,0.8), 0 0 15px ${newColor}40` }}
              />
            </div>

            <div className="playlist-edit-actions">
              <button onClick={handlePatchTitle} className="theme-btn">Quick Rename</button>
              <button onClick={handlePutReplace} className="theme-btn primary">Save All</button>
              <button onClick={() => setIsEditing(false)} className="back-btn">Cancel</button>
            </div>
          </div>
        )}
        <p style={{ marginTop: isEditing ? '0' : '15px', opacity: 0.8 }}>Custom Mixtape • {playlist.songs.length} tracks</p>
      </div>

      {playlist.songs.length === 0 ? (
        <div className="loading-state" style={{ position: 'relative', zIndex: 2 }}>
          <p>This tape is completely blank.</p>
          <button className="theme-btn" style={{ marginTop: '20px', width: 'auto' }} onClick={() => navigate('/')}>
            BROWSE FREQUENCIES
          </button>
        </div>
      ) : (
        <div className="song-grid" style={{ marginTop: '30px', position: 'relative', zIndex: 2 }}>
          {playlist.songs.map((song) => (
            <div key={song.trackId} className="song-card theme-hover-card">
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
                  className="remove-song-btn"
                  title="Remove from tape"
                >✖</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistView;