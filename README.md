# 🎵 Sonic Moods

> A mood-based music discovery web app with a retro cassette aesthetic. Pick how you're feeling, get matched with music, save your favourites, and track your vibe history — all backed by a secure REST API and MongoDB database.

---

## 📌 Project Overview

Sonic Moods lets users select their current mood (Happy, Sad, Angry, Relaxed) and instantly discovers matching songs using the iTunes Search API. Users can create accounts, like songs, build custom playlists (called "Mixtapes"), and view a personal mood history dashboard — all synced to a cloud database.

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, React Router v7, Vite                 |
| Backend    | Node.js, Express 5                              |
| Database   | MongoDB (Mongoose ODM)                          |
| Auth       | JWT (JSON Web Tokens) + bcryptjs                |
| Music API  | iTunes Search API (free, no key required)       |

---

## ✨ Features

- **Mood Selection** — Choose from Happy ☀️, Sad 🌧️, Angry 🌩️, or Relaxed ☕
- **Music Discovery** — Fetches songs from the iTunes API based on your mood
- **User Authentication** — Secure signup & login with password hashing and JWT
- **Liked Songs** — Save songs to your personal library
- **Custom Playlists (Mixtapes)** — Create, rename, and delete your own playlists; add/remove songs
- **Mood History Dashboard** — Visual breakdown of your logged moods over time
- **User Profile** — Edit your display name and bio; view your stats

---

## 📁 Project Structure

```
Sonic-Moods/
├── src/                          # React frontend
│   ├── components/
│   │   ├── Login.jsx             # Login form
│   │   ├── Signup.jsx            # Registration form
│   │   └── Navbar.jsx            # Navigation bar
│   ├── pages/
│   │   ├── Home.jsx              # Landing page with mood selector
│   │   ├── Happy/Sad/Angry/Relaxed.jsx  # Mood-specific song pages
│   │   ├── Playlists.jsx         # Library & playlist manager
│   │   ├── Playlistview.jsx      # Individual playlist view
│   │   ├── Likedsongs.jsx        # Liked songs library
│   │   ├── Mooddashboard.jsx     # Mood history charts
│   │   ├── Profile.jsx           # User profile & settings
│   │   └── moodStorage.js        # Mood save/fetch utility
│   ├── App.jsx                   # Main router
│   └── App.css                   # Global styles
│
├── music-backend/                # Express backend
│   ├── models/
│   │   └── User.js               # Mongoose User schema
│   ├── routes/
│   │   ├── Auth.js               # POST /signup, POST /login
│   │   └── Library.js            # All CRUD operations (protected)
│   ├── middleware/
│   │   └── requireAuth.js        # JWT verification middleware
│   ├── server.js                 # App entry point
│   ├── .env.example              # Environment variable template
│   └── package.json
│
├── public/                       # Static assets
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔌 Backend API Reference

**Base URL:** `http://localhost:5000`

All `/api/library/*` routes require the header:
```
Authorization: Bearer <your_jwt_token>
```

### Auth Routes (`/api/auth`)

| Method | Endpoint        | Description              | Body                                              |
|--------|-----------------|--------------------------|---------------------------------------------------|
| POST   | `/signup`       | Register a new user      | `{ fullName, username, dob, password, confirmPassword }` |
| POST   | `/login`        | Login & receive JWT      | `{ username, password }`                          |

### Library Routes (`/api/library`) — Protected 🔐

| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| GET    | `/likes`                              | Fetch all liked songs           |
| POST   | `/likes`                              | Add a song to liked songs       |
| DELETE | `/likes/:trackId`                     | Remove a song from liked songs  |
| GET    | `/playlists`                          | Fetch all user playlists        |
| POST   | `/playlists`                          | Create a new playlist           |
| PATCH  | `/playlists/:playlistId`              | Update playlist name/color      |
| PUT    | `/playlists/:playlistId`              | Replace a playlist fully        |
| DELETE | `/playlists/:playlistId`              | Delete a playlist               |
| POST   | `/playlists/:playlistId/songs`        | Add a song to a playlist        |
| DELETE | `/playlists/:playlistId/songs/:trackId` | Remove a song from a playlist |
| GET    | `/moods`                              | Fetch mood history              |
| POST   | `/moods`                              | Log a new mood entry            |

---

## 🗄️ Database Schema (MongoDB)

All user data is stored in a single **User** document:

```
User {
  fullName: String
  username: String (unique)
  dob: Date
  password: String (bcrypt hashed)
  likedSongs: [ Song ]
  customPlaylists: [ Playlist ]
  moodHistory: [ { mood: String, date: Date } ]
}

Song {
  trackId: Number
  trackName: String
  artistName: String
  artworkUrl100: String
  previewUrl: String
}

Playlist {
  id: String
  title: String
  mood: String
  color: String
  songs: [ Song ]
}
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- A MongoDB database (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — free tier works)
- nodemon installed globally *(optional but recommended)*: `npm install -g nodemon`

---

### ▶️ Step 1 — Run the Frontend

Open a terminal and run the following commands **one by one**:

```bash
cd react-app
npm install
npm run dev
```

> ✅ Frontend will be live at **http://localhost:5173**

---

### ▶️ Step 2 — Run the Backend

Open a **second terminal** (keep the frontend one running) and run:

```bash
cd music-backend
```

Before starting for the first time, create your `.env` file:

```bash
cp .env.example .env
```

Open the `.env` file and fill in your values:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/sonic-moods
JWT_SECRET=choose_a_long_random_secret_string
PORT=5000
```

Then install dependencies:

```bash
npm install
```

Start the server using **nodemon** *(auto-restarts on file changes — recommended)*:

```bash
nodemon server.js
```

Or using plain **node** *(no auto-restart)*:

```bash
node server.js
```

> ✅ Backend will be live at **http://localhost:5000**

---

> ⚠️ **Both terminals must stay running at the same time** for the app to work fully.

---

## 🧪 CRUD Operations Summary

| Operation | Feature                        | HTTP Method | Endpoint                                  |
|-----------|--------------------------------|-------------|-------------------------------------------|
| **Create**| Register user                  | POST        | `/api/auth/signup`                        |
| **Create**| Like a song                    | POST        | `/api/library/likes`                      |
| **Create**| Create playlist                | POST        | `/api/library/playlists`                  |
| **Create**| Add song to playlist           | POST        | `/api/library/playlists/:id/songs`        |
| **Create**| Log a mood                     | POST        | `/api/library/moods`                      |
| **Read**  | Fetch liked songs              | GET         | `/api/library/likes`                      |
| **Read**  | Fetch playlists                | GET         | `/api/library/playlists`                  |
| **Read**  | Fetch mood history             | GET         | `/api/library/moods`                      |
| **Update**| Rename/recolor playlist        | PATCH       | `/api/library/playlists/:id`              |
| **Delete**| Unlike a song                  | DELETE      | `/api/library/likes/:trackId`             |
| **Delete**| Delete playlist                | DELETE      | `/api/library/playlists/:id`              |
| **Delete**| Remove song from playlist      | DELETE      | `/api/library/playlists/:id/songs/:trackId` |

---

## 👤 Author

**Muhammad Danish**  
Project for: [EAD] 
Year: 2026

---

## 📄 License

This project was built for educational purposes.
