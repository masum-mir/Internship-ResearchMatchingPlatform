# Oppzy Frontend

React 18 · Vite · React Router 6 · Axios · Bootstrap 5 · Recharts

The Oppzy frontend provides the role-based user interface for Students, Companies, Faculty, and Admins.

---

## Frontend Structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── auth/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile
├── .dockerignore
├── nginx.conf
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## Prerequisites

- Node.js 18+
- npm
- Oppzy backend running at `http://localhost:8080`

---

## Setup

Open the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file if an example exists:

```bash
cp .env.example .env
```

For normal local development:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

For Docker/Nginx:

```env
VITE_API_BASE_URL=/api
```

---

## Run Frontend Locally

```bash
npm run dev
```

Development URL:

```text
http://localhost:5173
```

---

## Production Build

```bash
npm run build
```

Production output:

```text
dist/
```

---

## Main Frontend Features

- JWT authentication
- Automatic access-token refresh through Axios interceptor
- Role-based routes and dashboards
- Student opportunity browsing and application management
- Company internship management
- Faculty research opportunity management
- Admin dashboard and user management
- Match-score badges
- Responsive interface
- Dashboard charts with Recharts

---

## Backend Connection

For local development:

```text
http://localhost:8080/api
```

For Docker/Nginx:

```text
/api
```

Nginx forwards `/api` requests to the backend container.
