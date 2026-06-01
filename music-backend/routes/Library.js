// routes/library.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth'); // Bring in the bouncer

// Apply the bouncer to ALL routes in this file
router.use(requireAuth); 

// ==========================================
// LIKED SONGS ROUTES
// ==========================================

// 1. GET ALL LIKED SONGS
router.get('/likes', async (req, res) => {
  try {
    // req.user.userId comes from our requireAuth middleware!
    const user = await User.findById(req.user.userId);
    res.status(200).json(user.likedSongs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching liked songs" });
  }
});

// 2. ADD A SONG TO LIKES
router.post('/likes', async (req, res) => {
  try {
    const newSong = req.body;
    
    // Check if song already exists to prevent duplicates
    const user = await User.findById(req.user.userId);
    const alreadyLiked = user.likedSongs.some(song => song.trackId === newSong.trackId);
    
    if (alreadyLiked) {
      return res.status(400).json({ message: "Song already in liked library" });
    }

    user.likedSongs.push(newSong);
    await user.save();
    
    res.status(200).json({ message: "Song added!", likedSongs: user.likedSongs });
  } catch (error) {
    res.status(500).json({ message: "Error adding song" });
  }
});

// 3. REMOVE A SONG FROM LIKES
router.delete('/likes/:trackId', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    // Filter out the song with the matching trackId
    user.likedSongs = user.likedSongs.filter(song => song.trackId.toString() !== req.params.trackId);
    await user.save();
    
    res.status(200).json(user.likedSongs);
  } catch (error) {
    res.status(500).json({ message: "Error removing song" });
  }
});

// ==========================================
// PLAYLIST ROUTES
// ==========================================

// 1. GET ALL PLAYLISTS
router.get('/playlists', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user.customPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlists" });
  }
});

// 2. CREATE A NEW BLANK PLAYLIST
router.post('/playlists', async (req, res) => {
  try {
    const newPlaylist = req.body; // e.g., { id: '...', title: 'Late Night', color: '#fff', songs: [] }
    const user = await User.findById(req.user.userId);
    
    user.customPlaylists.push(newPlaylist);
    await user.save();
    
    res.status(200).json(user.customPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist" });
  }
});

// 3. ADD A SONG TO A SPECIFIC PLAYLIST
router.post('/playlists/:playlistId/songs', async (req, res) => {
  try {
    const song = req.body;
    const user = await User.findById(req.user.userId);
    
    // Find the right playlist
    const playlist = user.customPlaylists.find(p => p.id === req.params.playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    // Prevent duplicates
    const alreadyInTape = playlist.songs.some(s => s.trackId === song.trackId);
    if (alreadyInTape) return res.status(400).json({ message: "Song already on this tape" });

    playlist.songs.push(song);
    user.markModified('customPlaylists');
    await user.save();
    
    res.status(200).json(user.customPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Error adding song to playlist" });
  }
});

// DELETE A SONG FROM A PLAYLIST
router.delete('/playlists/:playlistId/songs/:trackId', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const playlist = user.customPlaylists.find(p => p.id === req.params.playlistId);
    
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    // Filter out the song and save
    playlist.songs = playlist.songs.filter(song => song.trackId.toString() !== req.params.trackId);
    await user.save();
    
    res.status(200).json(playlist); // Return the updated playlist
  } catch (error) {
    res.status(500).json({ message: "Error removing song from playlist" });
  }
});

module.exports = router;