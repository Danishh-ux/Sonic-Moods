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

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Account Data for DB:", formData);
    alert(`Account created for ${formData.fullName}!`);
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

          {/* Password Field with Toggle */}
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