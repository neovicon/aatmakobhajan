# आत्मा को भजन (Aatma Ko Bhajan)

A production-ready MERN application for browsing and reading Nepali song lyrics with automatic Romanization, role-based access, Cloudinary media, and a rich admin dashboard.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Zustand, React Router, React Helmet Async, Vite PWA
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, JWT Auth, bcrypt, Cloudinary, Multer, Zod

## Features
- 🎵 **Nepali Lyrics & Transliteration**: View lyrics in original Devanagari and Romanized phonetic forms.
- 📱 **PWA Ready**: Installable on mobile devices with offline caching.
- 🎨 **Modern UI**: Dark-first glassmorphism design with Framer Motion animations.
- 🔒 **Secure Auth**: JWT with httpOnly refresh tokens, rate limiting, xss protection, and account lockouts.
- 🎛️ **Admin Dashboard**: Full CRUD for songs, users, and media uploads to Cloudinary. Soft deletion and Audit Logs included.
- 🔊 **Media Support**: Custom HTML5 audio player and YouTube/MP4 video embeds.

## Setup Instructions

### Backend (server/)
1. Navigate to `/server` and run `npm install`.
2. Copy `.env.example` to `.env` and fill in your MongoDB URI, Cloudinary credentials, and JWT secrets.
3. Run `npm run dev` to start the backend server on `http://localhost:5000`.

### Frontend (client/)
1. Navigate to `/client` and run `npm install`.
2. Ensure the backend is running.
3. Run `npm run dev` to start the Vite dev server on `http://localhost:5173`.

### First Admin Account
The first user to register via `/register` will automatically be assigned the `admin` role. Subsequent registrations will be standard `user`s.

## Deployment
- **Frontend**: Connect `/client` to Vercel (uses `vercel.json` for SPA routing). Set `VITE_API_URL` to your production backend URL.
- **Backend**: Connect `/server` to Render (uses `render.yaml`). Ensure all environment variables are set.
# aatmakobhajan
