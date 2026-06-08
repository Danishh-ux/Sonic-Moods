import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [username, setUsername] = useState('Guest');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);


  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUsername = sessionStorage.getItem('username');

    if (token && storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('Guest');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('token');
    }
    
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    setUsername('Guest');
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
          <span className="brand-icon">📻</span>
          SONIC
        </Link>
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/playlists">PLAYLISTS</Link></li>
          <li><Link to="/liked">LIKED SONGS</Link></li>
          <li><Link to="/mood-dashboard">MOOD DASHBOARD</Link></li>
        </ul>

        <div className="nav-user" ref={dropdownRef}>
          {username === 'Guest' ? (
            <ul className="nav-links" style={{ gap: '1.5rem' }}>
              <li><Link to="/login">LOGIN</Link></li>
              <li><Link to="/signup">SIGN UP</Link></li>
            </ul>
          ) : (
            <>
              <span className="user-name">{username}</span>
              <div 
                className={`avatar ${dropdownOpen ? 'avatar--open' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              ></div>

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