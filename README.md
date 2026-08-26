# ykSells

MERN ecommerce capstone for The Tech Pulses Weeks 7-8 brief.

## Local development

1. Copy `server/.env.example` to `server/.env` and provide MongoDB, JWT, Stripe, Cloudinary, and SMTP values.
2. Copy `client/.env.example` to `client/.env` and set `VITE_API_URL`.
3. Run `npm install && npm run dev` in `server`.
4. Run `npm install && npm run dev` in `client`.

## Deployment

### Render backend

- Create a Web Service with root directory `server`.
- Build command: `npm install`
- Start command: `npm start`
- Add every variable from `server/.env.example`; set `CLIENT_URL` to the Vercel URL.

### Vercel frontend

- Import the repository with root directory `client`.
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL` as the live Render API URL ending in `/api` and `VITE_STRIPE_PUBLISHABLE_KEY`.

Never commit either `.env` file or live credentials.