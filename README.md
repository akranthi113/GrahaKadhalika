# GrahaKadhalika

A free, ad-free astrology website that generates accurate Vedic (sidereal) birth charts (Kundli) entirely in the browser using the Swiss Ephemeris compiled to WebAssembly.

## Features

- **Kundli Generator** — accurate sidereal birth chart with North/South Indian layouts, Vimsottari Dasa periods, and planet details. All calculations run client-side via WASM.
- **Chart Playground** — standalone Vedic chart visualizations (North Indian 3D, sidereal playground, South Indian enhanced).
- **Blogs** — signed-in users can publish posts; anyone can read them.
- **Accounts** — email/password sign-up with Supabase Auth, with a personal dashboard.
- **Free by design** — no payments, no ads.

## Tech Stack

- React 19 + Vite
- [@swisseph/browser](https://github.com/ewoij/swisseph) (Swiss Ephemeris WASM)
- [@astrologer/astro-core](https://www.npmjs.com/package/@astrologer/astro-core) + @astrologer/react-chart
- Supabase (Auth + Postgres)
- OpenStreetMap Nominatim (free place search/geocoding)

## Getting Started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run lint      # run oxlint
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase project details:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The `.env` file is gitignored and must be present on any machine that builds the site.

### Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Run the SQL in `supabase/migrations/schema.sql` in the Supabase SQL editor (creates `profiles` and `blogs` tables with row-level security).

## Deployment

This is a static SPA. Build with `npm run build` and host `dist/` anywhere (GitHub Pages, Netlify, Vercel, etc.).

- Assets use absolute paths (`base: '/'`), which requires serving from the domain root (works with a custom domain like `grahakadhalika.com`).
- Routing uses React Router's `BrowserRouter` with real paths (`/kundli`, `/blogs`). For SEO, `npm run build` also prerenders every static route into `dist/<route>/index.html` so crawlers get real HTML at HTTP 200 instead of a client-side shell. The `404.html` SPA fallback is kept for unmatched paths.
- Prerendering uses your local Chrome/Edge (auto-detected, or set `CHROME_PATH`). If no browser is found, the build still succeeds and simply skips the prerender step.

### GitHub Pages

The deploy script needs the `dist/` folder from a local `npm run build`, which automatically runs the prerender step:

```bash
npm run build     # builds dist/ and prerenders each route to real HTML
npm run deploy    # publishes dist/ via gh-pages
```

Notes:
- `.nojekyll` is included so GitHub Pages serves the built files without Jekyll processing.
- Deep links (`/kundli`, `/about`, etc.) are served from their prerendered `index.html` at HTTP 200, which is required for Bing/Google to crawl them.
- Configure the custom domain in your GitHub Pages settings; the sitemap and robots.txt reference `https://grahakadhalika.com/`.

## License

Private project.
