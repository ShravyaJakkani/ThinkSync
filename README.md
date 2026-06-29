# ThinkSync

A full-stack content-sharing platform for students to share innovations, poetry, question papers, achievements, announcements, and more.

## Features
- User content posting# ThinkSync

A full-stack content-sharing platform for students to share innovations, poetry, question papers, achievements, announcements, and more — now with user authentication, so every post is tied to a real account.

## Features

- User authentication (register/login) with JWT
- User content posting across 8 categories (Innovation, Poetry, Question Papers, Fun, Art, Announcement, Achievements, Opportunities)
- Image and PDF uploads via Cloudinary
- Category-wise post feeds
- Like / unlike functionality
- Owner-only post deletion (only the user who created a post can delete it)
- Responsive UI

## Tech Stack

**Frontend:** React, Vite, React Router, Axios
**Backend:** Node.js, Express.js, JWT, bcrypt
**Database:** MongoDB (Mongoose)
**File storage:** Cloudinary

## Live Demo

[ThinkSync Demo](https://thinksync-frontend.onrender.com/)

## GitHub

[https://github.com/ShravyaJakkani/ThinkSync](https://github.com/ShravyaJakkani/ThinkSync)

## Run Locally

Clone the repository

```bash
git clone https://github.com/ShravyaJakkani/ThinkSync.git
cd ThinkSync
```

This project has two separate apps — `client` and `server` — each with its own dependencies. There is no root-level install.

### 1. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/` with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Start the server:

```bash
npx nodemon index.js
```

### 2. Frontend setup

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The client will run on Vite's default port (typically `http://localhost:5173`) and the server on the `PORT` set above.

## Authentication Flow

1. A new user registers with username, email, and password — the password is hashed with bcrypt before being stored.
2. On login, the server verifies the password and returns a JWT signed with `JWT_SECRET`.
3. The token is stored client-side and sent as a `Bearer` token on every authenticated request (creating posts, liking, deleting).
4. Posts created while logged in are linked to the creator's account, so only that user can delete them later.

## Notes

- `.env` is required for the server to run locally — without it, JWT signing/verification and Cloudinary uploads will fail.
- Never commit your real `.env` file or secrets to GitHub.
- Image uploads with Cloudinary
- Category-wise posts
- Like functionality
- PIN-based post deletion
- Responsive UI

## Tech Stack
- React
- Node.js
- Express.js
- MongoDB
- Cloudinary

## Live Demo
[ThinkSync Demo](https://thinksync-frontend.onrender.com/)

## GitHub
[https://github.com/shravyajakkani/ThinkSync](https://github.com/ShravyaJakkani/ThinkSync.git)

## Run Locally

Clone the repository

```bash
git clone https://github.com/shravyajakkani/ThinkSync.git
```

Go to the project directory

```bash
cd ThinkSync
```

Install dependencies

```bash
npm install
```

Start the frontend

```bash
cd client
npm run dev
```

Start the backend

```bash
cd server
npx nodemon index.js
```
