import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    dob: '',
    country: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpper && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      alert("Security Error: Password must be at least 8 characters long, contain at least 1 capital letter, and 1 special character.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Security Error: Passwords do not match.");
      return;
    }
    console.log("Account Data for DB:", formData);

    alert(`Account initialized for ${formData.fullName}. Signal ready.`);
    navigate('/');
  };

  return (
    <div className="app-container theme-default" style={{ display: 'block', paddingTop: '80px', paddingBottom: '50px' }}>
      <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="auth-header">
          <h1>Establish Identity</h1>
          <p>Register your frequency profile to the database.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input name="fullName" type="text" placeholder="Danish Shaikh" required onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input name="username" type="text" placeholder="danish_vibe" required onChange={handleChange} />
          </div>
        
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Date of Birth</label>
              <input name="dob" type="date" required onChange={handleChange} />
            </div>
          </div>
          
          <div className="input-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              onChange={handleChange} 
            />
            <span 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </span>
            <small style={{ display: 'block', marginTop: '5px', opacity: 0.6, fontSize: '0.75rem' }}>
              Min 8 chars, 1 uppercase, 1 special character.
            </small>
          </div>

         <div className="input-group" style={{ position: 'relative' }}>
            <label>Confirm Password</label>
            <input 
              name="confirmPassword" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              onChange={handleChange} 
            />
            <span 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </span>
          </div>

          <button type="submit" className="auth-btn">Initialize Account</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;