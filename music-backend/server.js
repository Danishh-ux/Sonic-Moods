// server.js
require('dotenv').config(); // Loads our .env variables
const express = require('express');
const mongoose = require('mongoose');
const LibraryRoutes = require('./routes/Library');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Lets your React app talk to this server
app.use(express.json()); // <-- If this is missing, req.body will always be undefined!

app.use('/api/library', LibraryRoutes); // All routes in Library.js will be prefixed with /api/library

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Successfully connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic test route
app.get('/', (req, res) => {
  res.send('Melancholy API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server vibrating on port ${PORT}`);
});