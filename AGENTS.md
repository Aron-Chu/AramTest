# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

**ARAM Stats** is a single Next.js (Pages Router) app for League of Legends ARAM statistics. It uses MongoDB (Mongoose) for caching and the Riot Games API for live data.

### Required services

| Service | Notes |
|---------|-------|
| **MongoDB** | Required for all API routes and SSR champion pages. Not managed by `npm install`. |
| **Next.js dev server** | `npm run dev` on port 3000. |
| **Riot API** | Optional for local/demo flows with seeded MongoDB data; required for live summoner lookup from Riot. Set `RIOT_API_KEY` in `.env.local`. |

### MongoDB startup

MongoDB is **not** started automatically on VM boot. Before running the app, start it in a tmux session:

```bash
mongod --dbpath /data/db --bind_ip 127.0.0.1
```

Default connection string (see `.env.example`): `mongodb://127.0.0.1:27017/aramstats`

### Environment variables

Copy `.env.example` to `.env.local` and set:

- `MONGO_URI` — MongoDB connection string (required; `lib/dbConnect.ts` throws without it)
- `RIOT_API_KEY` — Riot developer API key (required for live Riot fetches)

### Standard commands

See `package.json` scripts:

- **Dev server:** `npm run dev` → http://localhost:3000
- **Build:** `npm run build`
- **Lint:** `npm run lint` (uses `.eslintrc.json`; warnings only for `<img>` usage)
- **Production:** `npm run build && npm run start`

### Demo / testing without a Riot key

Seed MongoDB with sample summoners, matches, and champions, then search for `DemoPlayer` (region `na1`) on the homepage. The leaderboard and summoner profile pages work from cached DB data alone.

### Gotchas

- Next.js 14 requires `legacyBehavior` on `<Link>` components that wrap `<a>` children (see `components/Layout.tsx`).
- `/champions` index route is not implemented; champion detail URLs use `/champions/[championId]` (e.g. `/champions/Ahri`).
- `pages/api/match.ts` calls Riot when no local matches exist for a summoner; use seeded data or a valid `RIOT_API_KEY` for that path.
