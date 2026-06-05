const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');


router.use(requireAuth); 

router.get('/likes', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user.likedSongs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching liked songs" });
  }
});

router.post('/likes', async (req, res) => {
  try {
    const newSong = req.body;
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

router.delete('/likes/:trackId', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.likedSongs = user.likedSongs.filter(song => song.trackId.toString() !== req.params.trackId);
    await user.save();
    
    res.status(200).json(user.likedSongs);
  } catch (error) {
    res.status(500).json({ message: "Error removing song" });
  }
});

router.get('/playlists', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user.customPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching playlists" });
  }
});

router.post('/playlists', async (req, res) => {
  try {
    const newPlaylist = req.body; 
    const user = await User.findById(req.user.userId);
    
    user.customPlaylists.push(newPlaylist);
    await user.save();
    
    res.status(200).json(user.customPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist" });
  }
});

router.post('/playlists/:playlistId/songs', async (req, res) => {
  try {
    const song = req.body;
    const user = await User.findById(req.user.userId);
    
    const playlist = user.customPlaylists.find(p => p.id === req.params.playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

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

router.delete('/playlists/:playlistId/songs/:trackId', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const playlist = user.customPlaylists.find(p => p.id === req.params.playlistId);
    
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs = playlist.songs.filter(song => song.trackId.toString() !== req.params.trackId);
    
    user.markModified('customPlaylists');
    await user.save();
    
    res.status(200).json(playlist); 
  } catch (error) {
    res.status(500).json({ message: "Error removing song from playlist" });
  }
});

router.put('/playlists/:playlistId', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const playlistIndex = user.customPlaylists.findIndex(p => p.id === req.params.playlistId);

    if (playlistIndex === -1) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    user.customPlaylists[playlistIndex] = req.body;

    user.markModified('customPlaylists');
    await user.save();

    res.status(200).json(user.customPlaylists);
  } catch (error) {
    res.status(500).json({ message: "Error replacing playlist" });
  }
});

router.patch('/playlists/:playlistId', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const playlist = user.customPlaylists.find(p => p.id === req.params.playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (req.body.title) playlist.title = req.body.title;
    if (req.body.color) playlist.color = req.body.color;

    user.markModified('customPlaylists');
    await user.save();

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Error updating playlist" });
  }
});

router.delete('/playlists/:playlistId', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    const initialLength = user.customPlaylists.length;

    user.customPlaylists = user.customPlaylists.filter(
      p => p.id !== req.params.playlistId
    );

    if (user.customPlaylists.length === initialLength) {
      return res.status(404).json({ message: "Tape not found" });
    }

    user.markModified('customPlaylists');
    await user.save();

    res.status(200).json({ message: "Tape completely erased." });
  } catch (error) {
    res.status(500).json({ message: "Error erasing tape" });
  }
});

router.post('/moods', async (req, res) => {
  try {
    const { mood } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.moodHistory.push({ mood });
    await user.save();

    res.status(200).json({ message: "Vibe synced successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/moods', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.moodHistory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;