# Namma Saloon

90s Kannada film songs — the ones that played in every Karnataka saloon.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Playlist

Add YouTube video IDs in [`src/lib/tracks.ts`](src/lib/tracks.ts) (`yt` field on each track). Prefer official label uploads. Empty IDs open a YouTube search instead.

## Analytics

Vercel Web Analytics is wired via `@vercel/analytics` (pageviews + `song_play` events). Free on Hobby for personal projects — enable Web Analytics in the Vercel project dashboard after deploy. Nothing fires on localhost.
