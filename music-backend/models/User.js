const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  trackId: { type: Number, required: true },
  trackName: { type: String, required: true },
  artistName: { type: String, required: true },
  artworkUrl100: { type: String },
  previewUrl: { type: String }
});

const playlistSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  title: { type: String, required: true },
  mood: { type: String, default: 'Custom Mix' },
  color: { type: String, default: '#d3d3d3' },
  songs: [songSchema] 
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  dob: { type: Date, required: true },
  password: { type: String, required: true },

  moodHistory: [{
    mood: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  likedSongs: [songSchema],
  customPlaylists: [playlistSchema]

}, { timestamps: true });

// 4. Export the Model
module.exports = mongoose.model('User', userSchema);