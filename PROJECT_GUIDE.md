# Night Coding Marathon — Project guide (for beginners)

This document explains **what this project does**, **how data flows**, and **which APIs exist** — written for someone new to full-stack apps.

---

## 1. What is this project?

It is an **interview preparation** web app:

- **Frontend** (React + Vite): pages for landing, sign up, login, dashboard, and a focused interview session screen.
- **Backend** (Node + Express): handles **authentication** (register / login) and is set up to support **sessions** (practice interviews) and **AI** (Google Gemini) helpers in code.
- **Database** (MongoDB): stores users, and (when those features are fully wired) sessions and questions.

Think of it as: **browser ↔ API (Express) ↔ MongoDB**, with optional **AI** calls from the server.

---

## 2. Big picture — request flow

```
User opens the website (React)
        │
        ▼
Clicks Sign up / Login
        │
        ▼
Frontend sends HTTP request to backend (e.g. POST /api/auth/login)
        │
        ▼
Express receives JSON body → checks MongoDB → returns JSON (e.g. token)
        │
        ▼
Frontend saves token (often in localStorage) and navigates to Dashboard
```

**Later steps (when all routes are connected):**

- Dashboard loads **your sessions** with `GET` + header **`Authorization: Bearer <your-token>`**.
- Creating a session or calling AI uses **POST** with the same header so the server knows **which user** is asking.

---

## 3. Folder structure (simple view)

| Folder | Role |
|--------|------|
| `frontend/` | React UI, routes, calls to API URLs from `src/utils/apiPaths.js` |
| `backend/` | Express server entry: `index.js` |
| `backend/routes/` | URL paths grouped by feature (`auth-route.js`, etc.) |
| `backend/controller/` | Business logic (talks to DB, calls AI) |
| `backend/models/` | Mongoose schemas (shape of documents in MongoDB) |
| `backend/middlewares/` | e.g. `protect` — “is this request allowed? (valid JWT?)” |
| `backend/config/` | Database connection helper |

---

## 4. Frontend pages (user journey)

| Path | Page | What the user does |
|------|------|---------------------|
| `/` | Landing | Marketing / entry |
| `/signup` | Sign up | Create account → usually goes to login or dashboard |
| `/login` | Login | Email + password → backend returns a **token** |
| `/dashboard` | Dashboard | See / manage interview sessions (needs APIs + token) |
| `/interview/:id` | Interview prep | Work inside one session (`:id` = session id in the URL) |

The **exact URLs** the frontend uses for the API are in `frontend/src/utils/apiPaths.js`.  
Set **`VITE_API_BASE_URL`** in the frontend (e.g. `.env`) to your backend base **without** `/api` — example: `http://localhost:9001` (your backend port may be **9001**; if the frontend still says 9000, fix it to match).

---

## 5. APIs explained

### 5.1 Words you will see

- **Method**: `GET` (read), `POST` (create / submit data), etc.
- **Endpoint**: path after the host, e.g. `/api/auth/login`.
- **JSON body**: data sent as `{ "email": "...", "password": "..." }`.
- **Header `Authorization`**: `Bearer <token>` — proves you logged in.
- **JWT**: a signed string the server gives after login; the server can verify it without storing the session in memory.

---

### 5.2 Currently mounted on the backend (`index.js`)

These are **live** if the server is running and MongoDB is connected:

| Method | URL | Auth | Body (JSON) | What it does |
|--------|-----|------|-------------|--------------|
| `POST` | `http://localhost:9001/api/auth/signup` | No | `name`, `email`, `password` | Creates user (password stored hashed) |
| `POST` | `http://localhost:9001/api/auth/login` | No | `email`, `password` | Checks credentials; returns user info + **token** |

**Example — Sign up (Postman / Thunder Client):**

- URL: `POST http://localhost:9001/api/auth/signup`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "name": "Ada",
    "email": "ada@example.com",
    "password": "strong-password"
  }
  ```

**Example — Login:**

- URL: `POST http://localhost:9001/api/auth/login`
- Same header, body: `{ "email": "ada@example.com", "password": "strong-password" }`

---

### 5.3 Planned in code + frontend (`apiPaths.js`) but not registered in `index.js` yet

The project **already contains** controllers and paths for more features. After you **import the routers** in `backend/index.js` and fix any small imports (e.g. `protect` on session routes), these would match what the frontend expects:

| Method | Intended URL | Auth | Purpose |
|--------|----------------|------|---------|
| `POST` | `/api/sessions/create` | Bearer token | Create an interview session (+ questions payload as designed) |
| `GET` | `/api/sessions/my-sessions` | Bearer token | List current user’s sessions |
| `GET` | `/api/sessions/:id` | Bearer token | One session (with questions) |
| `POST` | `/api/ai/generate-questions` | Bearer token | Body includes `sessionId` — AI generates questions and saves them |
| `POST` | `/api/ai/generate-explanation` | Bearer token | Body includes `question` — short AI explanation |

So: **today, only auth is guaranteed on the server**; the rest is **ready in files** but needs **wiring** in `index.js` (and env like `GEMINI_API_KEY` for AI).

---

## 6. Environment variables (backend)

Typical keys (see `backend/.env.example` and your real `.env`):

- **`MONGODB_URI`** — connection string to MongoDB (local or Atlas).
- **`JWT_SECRET`** — secret used to **verify** tokens on protected routes (should match how tokens are **signed** in auth code).
- **`GEMINI_API_KEY`** — for Google Gemini when you enable AI routes.

Never commit real `.env` files to Git.

---

## 7. How to run locally (short checklist)

1. **MongoDB** running or **Atlas** URI in `backend/.env`.
2. **Backend**: `cd backend` → `npm install` → `npm run dev` (or `npm start`).  
   Server listens on **port 9001** (as in `index.js`).
3. **Frontend**: `cd frontend` → `npm install` → set `VITE_API_BASE_URL=http://localhost:9001` → `npm run dev`.

---

## 8. One-sentence summary

**Users sign up and log in through REST APIs; the app is built to grow into AI-powered interview sessions stored in MongoDB — with session and AI endpoints already sketched in code and in the frontend API paths, waiting to be plugged into `index.js`.**

If you want the next step as a learning exercise: open `backend/index.js`, import `session-route` and an `ai` router (you may need to add `routes/ai-route.js` that maps URLs to `ai-controller`), mount them under `/api/sessions` and `/api/ai`, and add `Authorization: Bearer <token>` in Postman for protected calls.
