require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const LibraryRoutes = require('./routes/Library');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/library', LibraryRoutes);

const authRoutes = require('./routes/Auth');
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Successfully connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Melancholy API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server vibrating on port ${PORT}`);
});