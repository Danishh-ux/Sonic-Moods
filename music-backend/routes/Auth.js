const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ← Added this for login tokens
const User = require('../models/User'); 

// ==========================================
// 1. SIGNUP ROUTE (Your perfectly working code)
// ==========================================
router.post('/signup', async (req, res) => {
  try {
    const { fullName, username, dob, password, confirmPassword } = req.body;

    if (!fullName || !username || !dob || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, username, dob, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// ==========================================
// 2. LOGIN ROUTE (The missing piece!)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 2. Compare the typed password with the scrambled database password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // 3. Create a secure token (Session Pass)
    // It uses your .env JWT_SECRET, or a fallback string if you haven't set one yet
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'super_secret_melancholy_key', 
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // 4. Send the VIP pass back to React
    res.status(200).json({ 
      message: "Login successful", 
      token, 
      username: user.username 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;