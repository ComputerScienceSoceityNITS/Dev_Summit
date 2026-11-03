# Dev Summit 2026 — Phase 1

React + Vite single-page website (red / blue / white system) for Dev Summit 2026, Computer Science Society, NIT Silchar.

## Run locally
1. Install Node.js (LTS)
2. `npm install`
3. Copy `.env.example` to `.env` and set `VITE_GOOGLE_CLIENT_ID` to your Google OAuth Web client ID. Vercel routes `/api` to the deployed API using `vercel.json`; on other hosts, set `VITE_API_BASE_URL` to the backend origin.
4. `npm run dev` (development) or `npm run build && npm run preview` (production check)

Google sign-in also requires the same `GOOGLE_CLIENT_ID` in the backend environment. Configure the OAuth Web client with the frontend origin under authorized JavaScript origins. Sign-in is restricted to verified NIT Silchar Google accounts.

## What's included
- Animated terminal-style loading screen (progress, boot messages, skip button, reduced-motion aware): `src/Loader.jsx`
- CSS logo in the hero and footer; NIT Silchar logo in the footer. Files live in `public/assets/logos/`
- Landscape hero video (`public/assets/hero-bg.mp4`, rotated upright from the portrait source, ~6 MB) with a poster image; on phones it plays as a full-width 16:9 band above the headline
- Mobile-first polish: safe-area insets, 44px touch targets, readable label sizes, stacked layouts under 760px

Loader characters (`public/assets/loader/`) are transparent cut-outs of the supplied Optimus Prime and Bumblebee images.

## Admin features
Organisers get a protected dashboard at `#/admin` (linked as "ADMIN" in the footer). Sign in with the admin **username and password**.

- **Add event** — title, description, dates, venue, optional seat limit, open/closed status
- **Edit event** — update any detail, close registration, or change the seat limit
- **Delete event** — inside the Edit window; asks for confirmation and also removes that event's registrations
- **Registrations** — per-event count, seats left, experience breakdown, search/filter, each person's full response, and **Export CSV**

The frontend is a static Vite application and the API is deployed separately. On Vercel, configure the frontend project to build with `npm run build` and publish `dist`; configure the backend project with its own environment variables. Do not use the frontend `start` script as an API server.
