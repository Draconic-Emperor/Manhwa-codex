# Manhwa Codex

A community-driven archive for manhwa series, characters, lore, rankings, and theories.

Built with **React + Vite + Supabase**.

## Quick start

```bash
npm install
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

## Deploy

```bash
npm run build
# Upload the `dist/` folder to Vercel, Netlify, Cloudflare Pages, etc.
# Set the same VITE_SUPABASE_* env vars in your host's dashboard.
```

## Supabase setup

### Required tables

You need tables: `manhwa`, `characters`, `insights` (see your existing schema).

### Image uploads (covers + character portraits)

1. Run `supabase/STORAGE_SETUP.sql` in the Supabase SQL editor.
2. That creates a public `covers` bucket so drag-and-drop uploads work from the forms.
3. If storage isn't set up yet, users can still paste a public image URL.

### Optional upgrades

See `supabase/OPTIONAL_SCHEMA_UPGRADE.sql` for character stats, aliases, abilities, shared favorites, and insight votes.

## Features

- Browse / search series & characters (⌘K global search)
- Upload cover images and character portraits (drag-and-drop or URL)
- Full create / edit / delete for series, characters, and insights
- Power scaling rankings, collections (favorites), community insights
- Cinematic loading screen, polished auth modal, offline banner
- Dark, immersive webtoon-realm UI

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
