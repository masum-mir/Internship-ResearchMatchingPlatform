# Internship & Research Matching Platform — Frontend

React 18 · Vite · React Router 6 · Axios · Bootstrap 5 · Recharts

## Prerequisites
- Node.js 18+
- The backend running at `http://localhost:8080` (see the backend project)

## Setup
```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if needed
npm run dev            # starts on http://localhost:5173
```

Build for production: `npm run build` (output in `dist/`).

## What's included
- **JWT auth** with automatic access-token refresh and rotation handled in the
  Axios interceptor (`src/api/axiosClient.js`); tokens kept in `localStorage`.
- **Role-based routing** (`src/routes/AppRoutes.jsx`) with `ProtectedRoute` and
  `RoleRoute` guards. Each role lands on its own dashboard and sees its own sidebar.
- **Student**: dashboard, full profile manager (details, skills, projects,
  certifications), match-ranked internship/research browsing with search,
  one-click apply & bookmark, applications list, bookmarks.
- **Company**: dashboard, profile, internship CRUD, applicant inbox (sorted by
  match score) with status decisions and portfolio view.
- **Faculty**: the same for research opportunities.
- **Admin**: dashboard, user management (block/unblock), reports with pie & bar
  charts (Recharts) fed by the backend report endpoint.

## Backend pairing
This app calls the REST API documented in the backend's `API_TESTING.md`.
The default admin (`admin@ewu.edu` / `Admin@12345`) is seeded by the backend.

## Notes
- The match badge is color-coded: green ≥ 75%, amber ≥ 50%, red below.
- CORS origins are configured on the backend via `CORS_ORIGINS` (defaults include
  `http://localhost:5173`).
