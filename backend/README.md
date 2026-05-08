# Libra'z Beauty Salon — API server

Express API with JSON file storage (`data/bookings.json`).

## Setup

```bash
npm install
```

Optional: copy `.env.example` to `.env` and set `ADMIN_PASSWORD` and `PORT`.

## Run

```bash
npm start
```

- Booking page: `http://localhost:3000/index.html`
- Admin: `http://localhost:3000/admin.html`
- Health: `GET /health`

## API

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/api/bookings` | Public |
| `GET` | `/api/bookings` | Header `x-admin-password` |
| `PATCH` | `/api/bookings/:id/status` | Header `x-admin-password` |

Default admin password (if env unset): `librazadmin`.

## Deploy

### Single service (Render / Railway / VPS)

From repo root that contains `frontend/` and this `backend/` folder:

- **Start command:** `cd backend && npm install && npm start`
- **Root directory:** repository root (parent of `backend/`), or set start command to match your layout.

The server serves static files from `../frontend` relative to `server.js`.

### Split: Vercel (frontend) + Render (API)

1. Deploy this folder as a Node web service on Render.
2. Deploy `frontend/` to Vercel as a static site.
3. Before loading `script.js`, set the API origin:

```html
<script>window.API_BASE = "https://your-service.onrender.com";</script>
<script src="script.js"></script>
```

Use the same pattern on `index.html`, `success.html`, and `admin.html`.
