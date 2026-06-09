import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [currentMood, setCurrentMood] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ likes: 0, tapes: 0 });
  const navigate = useNavigate();

  const moods = [
    { id: 'happy', label: 'Happy', icon: '☀️' },
    { id: 'sad', label: 'Sad', icon: '🌧️' },
    { id: 'angry', label: 'Angry', icon: '🌩️' },
    { id: 'relaxed', label: 'Relaxed', icon: '☕' },
  ];

  const moodSearchTerms = {
    happy: 'feel good upbeat pop',
    sad: 'melancholy acoustic',
    angry: 'heavy metal rock',
    relaxed: 'lofi chill beats',
  };
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const fetchStats = async () => {
      try {
        const [likesRes, tapesRes] = await Promise.all([
          fetch('http://localhost:5000/api/library/likes', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/library/playlists', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (likesRes.ok && tapesRes.ok) {
          const likesData = await likesRes.json();
          const tapesData = await tapesRes.json();
          setStats({ likes: likesData.length, tapes: tapesData.length });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleMoodClick = (moodId) => {
    if (currentMood === moodId) {
      navigate(`/${moodId}`);
    } else {
      setCurrentMood(moodId);
    }
  };

  useEffect(() => {
    if (!currentMood) return;

    const fetchSongFromiTunes = async () => {
      setIsLoading(true);
      setCurrentTrack(null);
      try {
        const searchTerm = moodSearchTerms[currentMood];
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=15`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const track = data.results[randomIndex];
          setCurrentTrack({
            title: track.trackName,
            artist: track.artistName,
            artwork: track.artworkUrl100.replace('100x100', '300x300'),
            previewUrl: track.previewUrl
          });
        }
      } catch (error) {
        console.error("Error fetching from iTunes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongFromiTunes();
  }, [currentMood]);

  return (
    <div className={`app-container ${currentMood ? `theme-${currentMood}` : 'theme-default'}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <div className="ticker-wrap">
        <div className="ticker">
          // SYS.ONLINE // INTERCEPTING LOCAL FREQUENCIES // 432Hz HARMONICS DETECTED // AWAITING USER INPUT // CONNECTION SECURE //
        </div>
      </div>

      <header className="header" style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>SONIC MOODS</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
          <p style={{ margin: 0, letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.7 }}>
            {currentMood ? `TUNING: ${currentMood.toUpperCase()}` : 'SELECT FREQUENCY DIAL'}
          </p>
        </div>
      </header>

      <main className="mood-grid" style={{ marginTop: '40px', padding: '0 20px' }}>
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`mood-card ${currentMood === mood.id ? 'active' : ''}`}
            onClick={() => handleMoodClick(mood.id)}
          >
            <span className="mood-icon">{mood.icon}</span>
            <h2>{mood.label}</h2>
          </button>
        ))}
      </main>

      {!currentMood && (
        <div className="idle-visualizer-container" style={{ marginTop: '60px' }}>
          <div className="visualizer-bars">
            <div className="bar"></div><div className="bar"></div><div className="bar"></div>
            <div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div>
          </div>
          <p className="idle-text">System Idle...</p>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '220px', paddingBottom: '20px' }}>
        {currentMood && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', animation: 'fadeIn 0.5s ease' }}>
            <div className="player-preview" style={{ margin: 0 }}>
              <div className="now-playing">
                <div className="cassette-wheel"></div>
                <div className="track-info">
                  {isLoading ? (
                    <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Signal acquired. Decoding...</p>
                  ) : currentTrack ? (
                    <>
                      {currentTrack.artwork && <img src={currentTrack.artwork} alt="Album Art" className="track-artwork" />}
                      <div className="track-details">
                        <span className="track-title">{currentTrack.title}</span>
                        <span className="track-artist">{currentTrack.artist}</span>
                      </div>
                    </>
                  ) : <p>Static...</p>}
                </div>
                <div className="cassette-wheel"></div>
              </div>
            </div>
            <button className="auth-btn" onClick={() => navigate(`/${currentMood}`)} style={{ width: 'auto', padding: '12px 30px', fontSize: '0.9rem', letterSpacing: '2px', background: 'white', color: 'black' }}>
              ENTER LOG →
            </button>
          </div>
        )}
      </div>

      <div className="terminal-footer">
        <div style={{ display: 'flex', alignItems: 'center', width: '150px' }}>
          <span className="status-dot"></span>
          <span>NODE_ACTIVE</span>
        </div>
        <div className="terminal-data">
          SYS_ARCHIVE [ LIKES: {String(stats.likes).padStart(3, '0')} | TAPES: {String(stats.tapes).padStart(2, '0')} ] STATUS: OPTIMAL
        </div>
        <div style={{ width: '150px', textAlign: 'right' }}>
          FREQ // 432Hz
        </div>
      </div>
    </div>
  );
};

export default Home;