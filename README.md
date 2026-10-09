# Cymor Tune

Search, stream and download music — by Legendary Smiley Cymor / Cymor Tech Services.

A full-stack PWA:
- `backend/` — Express API (search via `yt-search`, stream + download via the EliteProTech conversion API), deploy to **Heroku**.
- `frontend/` — React + Vite PWA, installable, deploy to **Vercel**.

## 1. Deploy the backend (Heroku)

```bash
cd backend
heroku create your-cymor-tune-backend
git init
git add .
git commit -m "Cymor Tune backend"
heroku git:remote -a your-cymor-tune-backend
git push heroku main
```

No environment variables are required to boot — `DOWNLOAD_API_BASE` is optional (see `.env.example`) if you ever need to point at a different conversion API. Heroku sets `PORT` automatically.

Once deployed, note the URL, e.g. `https://your-cymor-tune-backend.herokuapp.com`.

## 2. Deploy the frontend (Vercel)

```bash
cd frontend
npm install
```

Set the environment variable in your Vercel project settings (or a local `.env` for testing):

```
VITE_API_BASE_URL=https://your-cymor-tune-backend.herokuapp.com
```

Then either `vercel deploy` with the Vercel CLI, or connect the `frontend/` folder as the project root in the Vercel dashboard (Framework Preset: Vite).

## 3. Local development

```bash
# Terminal 1
cd backend && npm install && npm start

# Terminal 2
cd frontend && npm install && npm run dev
```

Create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:3000` for local dev.

## Notes

- The MP3/MP4 conversion backend (EliteProTech) is a third-party free API — same one powering Cymor Tech Services' WhatsApp bot `.play` command. If it ever goes down, swap the base URL in `backend/lib/resolver.js` (or via `DOWNLOAD_API_BASE`) — it's the only file that talks to it.
- Download "history" in the Downloads tab is a client-side log (localStorage) of what's been downloaded, with a re-download link — browsers don't let web apps read back saved files, so this isn't an in-app file manager, just a history.
- PWA installability: Chrome/Edge on Android and desktop show an install prompt automatically; iOS Safari requires "Add to Home Screen" from the share sheet (no programmatic prompt exists on iOS — this is a platform limitation, not a bug in the app).
