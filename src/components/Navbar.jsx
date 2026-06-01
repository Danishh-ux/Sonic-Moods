import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [username, setUsername] = useState('Guest');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // 1. The "Memory Reader"
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('Guest');
    }
    // Close dropdown whenever the page changes
    setDropdownOpen(false);
  }, [location]);

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. The Logout Switch
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('Guest');
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Added the container your CSS expects */}
      <div className="navbar-container">
        
        {/* ---- Brand ---- */}
        <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
          <span className="brand-icon">📻</span>
          SONIC
        </Link>

        {/* ---- Nav Links ---- */}
        {/* Changed from divs to a ul list to match your CSS styling */}
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/playlists">PLAYLISTS</Link></li>
          <li><Link to="/liked">LIKED SONGS</Link></li>
        </ul>

        {/* ---- User Area ---- */}
        <div className="nav-user" ref={dropdownRef}>
          {username === 'Guest' ? (
            // Reused your sleek nav-links style for the login/signup buttons
            <ul className="nav-links" style={{ gap: '1.5rem' }}>
              <li><Link to="/login">LOGIN</Link></li>
              <li><Link to="/signup">SIGN UP</Link></li>
            </ul>
          ) : (
            <>
              <span className="user-name">{username}</span>
              
              {/* Clicking the avatar toggles the dropdown state */}
              <div 
                className={`avatar ${dropdownOpen ? 'avatar--open' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              ></div>

              {/* ---- Profile Dropdown ---- */}
              {/* This renders the animated dropdown from your CSS */}
              {dropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar"></div>
                    <div>
                      <p className="dropdown-name">{username}</p>
                      <p className="dropdown-email">user@sonic.app</p>
                    </div>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                    Profile
                  </button>
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;