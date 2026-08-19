# NVN Cars — Premium Automotive Care Platform

A full-stack website and admin dashboard for NVN Cars (Baghdad, Al Mansour).

## Stack

- **Client**: React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit + RTK Query, Framer Motion, GSAP/ScrollTrigger, Lenis, react-i18next (EN/AR, RTL-aware)
- **Server**: Node.js, Express, TypeScript, Prisma (SQLite by default, Postgres-ready), JWT auth, Zod validation, Helmet/CORS/rate-limiting
- **Database**: SQLite for local development (`server/prisma/dev.db`). Point `DATABASE_URL` at Postgres for production — no schema changes needed.

## Project structure

```
nvn-cars/
  server/    Express API — controllers/routes/validators/middleware, Prisma schema + seed
  client/    React app — public site (/) + admin dashboard (/admin)
```

## Getting started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # then edit SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD / JWT_SECRET
npx prisma migrate dev --name init
npm run dev                # http://localhost:4000
```

The seed creates one admin user (from `.env`) and the 10 NVN Cars services, the Al Mansour location (with the Waze link), and base SEO settings. It deliberately leaves gallery, before/after, and reviews empty — add real photography and genuine reviews via the dashboard.

### 2. Frontend

```bash
cd client
npm install
npm run dev                # http://localhost:5173 (proxies /api to :4000)
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` for the dashboard.

## What's intentionally stubbed

Per the brief, nothing in this project invents brand assets, numbers, or content that wasn't supplied:

- **Logo**: falls back to a styled "NVN" wordmark until a real logo is uploaded via Settings → Branding.
- **Photography**: hero/service/gallery images render a labeled placeholder panel until real photos are added (via image URLs — wire up Cloudinary or another CDN by setting `CLOUDINARY_URL` and swapping the admin image inputs for an uploader).
- **Instagram**: the on-site grid is manually managed from the dashboard (Social Posts) until `INSTAGRAM_ACCESS_TOKEN` / `INSTAGRAM_BUSINESS_ACCOUNT_ID` are wired up to the Graph API.
- **WhatsApp / phone**: the floating WhatsApp button and contact details only render once a number is set in Settings — no placeholder number is hardcoded.
- **Reviews / stats**: no fake reviews or fabricated numeric stats are seeded; the About section uses qualitative statements instead of invented numbers.

## Admin dashboard

`/admin` (protected by JWT) covers: overview analytics, bookings (filter/status workflow), services, gallery, before/after, reviews (approve before they go public), locations, and site settings (branding, contact, social, SEO, feature toggles).

## Environment variables

See `server/.env.example` for the full list (database, JWT, seed admin, CORS origin, and optional Cloudinary/Instagram/WhatsApp integration keys for future use).
