import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account synchronized. Welcome to the frequency.");
        navigate('/login');
      } else {
        alert(data.message); 
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server is offline. Check your backend connection.");
    }
  };

  return (
    <div className="auth-page theme-sad">
      <div className="auth-split-container">
        <div className="auth-showcase">
          <h1 className="showcase-title">Tune Into Your Vibe.</h1>
          <p className="showcase-subtitle">Create a free tape account to unlock the full frequency.</p>
          
          <ul className="feature-list">
            <li className="feature-item">
              <div className="feature-icon">📼</div>
              <div className="feature-text">
                <h3>Curate Custom Mixtapes</h3>
                <p>Build and save personalized playlists for your aesthetic.</p>
              </div>
            </li>
            
            <li className="feature-item">
              <div className="feature-icon">🖤</div>
              <div className="feature-text">
                <h3>Save Your Favorites</h3>
                <p>Heart the tracks that hit right and keep them on loop.</p>
              </div>
            </li>
            
            <li className="feature-item">
              <div className="feature-icon">📟</div>
              <div className="feature-text">
                <h3>Personal Vibe Profile</h3>
                <p>Track your listening history with a retro-styled mood dashboard.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="auth-card">
          <h2>Join the Frequency</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="date" name="dob" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
            </div>
            <button type="submit" className="auth-submit-btn">Create Tape Account</button>
          </form>
          
          <p className="auth-footer" style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
            Already have a signal? <Link to="/login" style={{ color: '#fff' }}>Login here</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Signup;