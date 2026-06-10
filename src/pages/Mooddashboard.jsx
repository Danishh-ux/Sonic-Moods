import React, { useState, useEffect } from 'react';
import { fetchMoodHistory, clearMoodHistory } from './moodStorage';
import '../App.css';

const MOOD_COLORS = {
  Chill: '#4ECDC4',
  Energetic: '#FF6B6B',
  Melancholic: '#45B7D1',
  Happy: '#FFEEAD',
  Focused: '#96CEB4',
  Angry: '#D4A5A5',
  Relaxed: '#A78BFA'
};

const MoodDashboard = () => {
  const [moodData, setMoodData] = useState([]);
  const [totalMoods, setTotalMoods] = useState(0);
  const [recentLogs, setRecentLogs] = useState([]);

  const loadData = async () => {
    try {
      const rawHistory = await fetchMoodHistory();

      if (!rawHistory || rawHistory.length === 0) {
        setMoodData([]);
        setRecentLogs([]);
        setTotalMoods(0);
        return;
      }

      const sortedHistory = [...rawHistory]
        .sort(
          (a, b) =>
            new Date(b.date || b.createdAt) -
            new Date(a.date || a.createdAt)
        )
        .slice(0, 5);

      setRecentLogs(sortedHistory);

      const moodCounts = rawHistory.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.keys(moodCounts)
        .map((mood) => ({
          name: mood,
          value: moodCounts[mood]
        }))
        .sort((a, b) => b.value - a.value);

      setMoodData(chartData);
      setTotalMoods(rawHistory.length);
    } catch (error) {
      console.error('Failed to load mood history:', error);
      setMoodData([]);
      setRecentLogs([]);
      setTotalMoods(0);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearHistory = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset your vibe history?'
    );

    if (!confirmed) return;

    try {
      await clearMoodHistory();

      setMoodData([]);
      setRecentLogs([]);
      setTotalMoods(0);

      await loadData();
    } catch (error) {
      console.error('Failed to clear history:', error);
      alert('Failed to clear mood history.');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown time';

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const topVibe = moodData.length > 0 ? moodData[0].name : 'None';

  if (moodData.length === 0 && recentLogs.length === 0) {
    return (
      <div className="dashboard-container empty-state">
        <h2>Your Vibe History</h2>
        <p>No moods logged yet. Go feel something!</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container wide">
      <div className="dashboard-header-row">
        <h2>Your Vibe History</h2>

        <button
          className="reset-btn"
          onClick={handleClearHistory}
        >
          Reset History
        </button>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Dominant Vibe</span>
          <span
            className="stat-value"
            style={{
              color: MOOD_COLORS[topVibe] || '#fff'
            }}
          >
            {topVibe}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Total Moods Logged
          </span>
          <span className="stat-value">
            {totalMoods}
          </span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3 className="section-title">Breakdown</h3>

          <div className="mood-bars-wrapper">
            {moodData.map((item, index) => {
              const percentage =
                totalMoods > 0
                  ? Math.round(
                      (item.value / totalMoods) * 100
                    )
                  : 0;

              const barColor =
                MOOD_COLORS[item.name] || '#A78BFA';

              return (
                <div
                  key={index}
                  className="mood-item"
                >
                  <div className="mood-labels">
                    <span className="mood-name">
                      {item.name}
                    </span>

                    <span className="mood-percentage">
                      {percentage}%
                    </span>
                  </div>

                  <div className="mood-bar-track">
                    <div
                      className="mood-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: barColor
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">
            Recent Activity
          </h3>

          <div className="recent-logs-wrapper">
            {recentLogs.map((log, index) => (
              <div
                key={index}
                className="log-item"
              >
                <div
                  className="log-icon"
                  style={{
                    backgroundColor:
                      MOOD_COLORS[log.mood] || '#555'
                  }}
                />

                <div className="log-details">
                  <span className="log-mood">
                    Felt <strong>{log.mood}</strong>
                  </span>

                  <span className="log-time">
                    Today at{' '}
                    {formatTime(
                      log.date || log.createdAt
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodDashboard;