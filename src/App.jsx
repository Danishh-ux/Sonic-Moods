import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Happy from './pages/Happy';
import Sad from './pages/Sad'; 
import Angry from './pages/Angry';
import Relaxed from './pages/Relaxed';
import Playlists from './pages/Playlists';
import LikedSongs from './pages/LikedSongs';
import PlaylistView from './pages/PlaylistView';
import Profile from "./pages/Profile";
import MoodDashboard from './pages/Mooddashboard';


// Choose ONE location for Signup. 
// If you put it in components, use this:
import Signup from './components/Signup'; 
import Login from './components/Login'; // Add this for the next step!

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="noise-overlay"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/happy" element={<Happy />} />
        <Route path="/sad" element={<Sad />} /> 
        <Route path="/angry" element={<Angry />} />
        <Route path="/relaxed" element={<Relaxed />} />
        <Route path="/playlists" element={<Playlists />} />
        
        <Route path="/playlist/:id" element={<PlaylistView />} />
        
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mood-dashboard" element={<MoodDashboard />} />
        <Route path="/liked" element={<LikedSongs />} />
      </Routes>
    </Router>
  );
}

export default App;