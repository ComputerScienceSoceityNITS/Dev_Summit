# Dev Summit 2026 — Phase 1

React + Vite single-page website (red / blue / white system) for Dev Summit 2026, Computer Science Society, NIT Silchar.

## Run locally
1. Install Node.js (LTS)
2. `npm install`
3. `npm run dev` (development) or `npm run build && npm run preview` (production check)

## What's included
- Animated terminal-style loading screen (progress, boot messages, skip button, reduced-motion aware): `src/Loader.jsx`
- CSS logo in the hero and footer; NIT Silchar logo in the footer. Files live in `public/assets/logos/`
- Landscape hero video (`public/assets/hero-bg.mp4`, rotated upright from the portrait source, ~6 MB) with a poster image; on phones it plays as a full-width 16:9 band above the headline
- Mobile-first polish: safe-area insets, 44px touch targets, readable label sizes, stacked layouts under 760px

Loader characters (`public/assets/loader/`) are transparent cut-outs of the supplied Optimus Prime and Bumblebee images.
