# 🎧 Sonic Moods

A mood-based music discovery web app. Pick how you're feeling, get a curated playlist of real songs from the iTunes library, preview tracks, like them, and save them to your own personal mixtapes — all stored to your account.

---

## Features

- **Mood Selection** — Choose from Happy ☀️, Sad 🌧️, Angry 🌩️, or Relaxed ☕ to browse a matching playlist
- **Live Music Preview** — Songs and 30-second previews pulled from the iTunes Search API (no API key needed)
- **User Accounts** — Sign up and log in with JWT-based authentication
- **Liked Songs** — Heart any track to save it to your personal library
- **Custom Mixtapes** — Create named playlists and add songs from any mood page
- **Dashboard Stats** — Home screen shows your total liked songs and tape count

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- iTunes Search API (free, no key required)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken) for auth
- bcryptjs for password hashing

---

## Project Structure

```
my-react-app/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── pages/
│   │   ├── Home.jsx         # Mood selector + preview player
│   │   ├── Happy.jsx        # Mood playlist pages (x4)
│   │   ├── Sad.jsx
│   │   ├── Angry.jsx
│   │   ├── Relaxed.jsx
│   │   ├── Playlists.jsx    # User library + mixtape manager
│   │   ├── PlaylistView.jsx # Individual mixtape view
│   │   └── LikedSongs.jsx
│   ├── App.jsx
│   └── main.jsx
│
└── music-backend/
    ├── models/
    │   └── User.js          # Mongoose schema (user, songs, playlists)
    ├── routes/
    │   ├── Auth.js          # POST /signup, POST /login
    │   └── Library.js       # Likes + playlists CRUD
    ├── middleware/
    │   └── requireAuth.js   # JWT verification middleware
    └── server.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Sonic-Moods.git
cd sonic-moods
```

---

### 2. Set up the backend

```bash
cd music-backend
npm install
```

Create a `.env` file inside `music-backend/`:

```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the backend server:

```bash
npm start
```

The API will be running at `http://localhost:5000`.

---

### 3. Set up the frontend

In a new terminal, from the root of the project:

```bash
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## API Endpoints

All `/api/library` routes require a `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/library/likes` | Get all liked songs |
| POST | `/api/library/likes` | Like a song |
| DELETE | `/api/library/likes/:trackId` | Unlike a song |
| GET | `/api/library/playlists` | Get all mixtapes |
| POST | `/api/library/playlists` | Create a new mixtape |
| POST | `/api/library/playlists/:id/songs` | Add a song to a mixtape |
| DELETE | `/api/library/playlists/:id/songs/:trackId` | Remove a song from a mixtape |

---

## Available Scripts

**Frontend (root)**

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

**Backend (`music-backend/`)**

| Command | Description |
|---|---|
| `npm start` | Start the Express server |

---

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `MONGO_URI` | `music-backend/.env` | Your MongoDB connection string |
| `JWT_SECRET` | `music-backend/.env` | Secret key for signing JWT tokens |
| `PORT` | `music-backend/.env` | Backend port (default: 5000) |

---

## License

This project is open source. Feel free to use and build on it.
