import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // SAVE THE TOKEN! This is how the app remembers you're logged in
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        
        alert(`Welcome back, ${data.username}`);
        navigate('/'); // Go to home page
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Connection to signal lost (Backend offline)");
    }
  };

  return (
    <div className="auth-page theme-sad">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🌑 Reconnect</h1>
          <p>Enter your credentials to access your tapes</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" placeholder="Your unique handle" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <button type="submit" className="auth-submit-btn">Login to Frequency</button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;