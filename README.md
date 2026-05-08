# Libra'z Beauty Salon Booking System

Full-stack appointment booking website for **Libra'z Beauty Salon (By Asma Naz)**.

## Structure

- [`frontend/`](frontend/) — static pages (`index.html`, `success.html`, `admin.html`, `style.css`, `script.js`)
- [`backend/`](backend/) — Node.js + Express API, JSON storage, `routes/`, `middleware/`, `lib/bookingStore.js`

See also [`backend/README.md`](backend/README.md) for API and deployment details.

## Run locally

1. `cd backend`
2. `npm install`
3. (Optional) copy `backend/.env.example` to `backend/.env`
4. `npm start`
5. Open `http://localhost:3000/index.html` (booking) and `http://localhost:3000/admin.html` (admin)

## API summary

- `POST /api/bookings` — create booking
- `GET /api/bookings` — list (header `x-admin-password`)
- `PATCH /api/bookings/:id/status` — update status (same header)

Default admin password: `librazadmin` (override with `ADMIN_PASSWORD`).

## Deploy

- **Single host (e.g. Render):** start command `cd backend && npm install && npm start` from this repo root (adjust path if your repo layout differs).
- **Vercel + API host:** deploy `frontend/` as static; deploy `backend/` as Node. Set `window.API_BASE` to your API URL before `script.js` on each HTML page (see `backend/README.md`).
