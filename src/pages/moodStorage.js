const MOOD_HISTORY_KEY = 'sonic_mood_history';

export const saveMood = async (moodName) => {
  const token = sessionStorage.getItem('token');

  if (token) {
    try {
      await fetch('http://localhost:5000/api/library/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mood: moodName })
      });
    } catch (error) {
      console.error("Failed to sync mood to server:", error);
    }
  } else {
    const existingHistory = JSON.parse(localStorage.getItem(MOOD_HISTORY_KEY)) || [];
    const newEntry = { mood: moodName, date: new Date().toISOString() };
    const updatedHistory = [...existingHistory, newEntry];
    localStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(updatedHistory));
  }
};

export const fetchMoodHistory = async () => {
  const token = sessionStorage.getItem('token');

  if (token) {
    try {
      const response = await fetch('http://localhost:5000/api/library/moods', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Failed to fetch moods from server:", error);
      return [];
    }
  }
  return JSON.parse(localStorage.getItem(MOOD_HISTORY_KEY)) || [];
};