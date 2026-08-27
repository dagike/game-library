# game-library

A personal web app for showing off favorite game titles: a public list of quick-view cards (cover, title, star rating) with search and filters, plus a detail page per game with full info, a personal rating and ranking, personal notes, and open public comments.

- **Stack**: Next.js (App Router, TypeScript), Tailwind CSS, Postgres (Neon) via Drizzle ORM, deployed on Vercel.
- **Game data**: imported from the [RAWG API](https://rawg.io/apidocs) rather than typed in by hand.
- **Access**: anyone can browse and comment; only the site owner (a single seeded account) can add/edit/delete games.

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL and SESSION_SECRET (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Database (Neon)

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the connection string from the Neon dashboard and set it as `DATABASE_URL` in `.env.local`.
3. Apply the schema:

   ```bash
   npx drizzle-kit migrate
   ```

Schema lives in `lib/db/schema.ts`; migrations are generated with `npx drizzle-kit generate` and committed to `drizzle/`.

## Auth

There's no public sign-up — the one owner account is created with a seed script. Also generate a `SESSION_SECRET` (used to sign session cookies) and set it in `.env.local`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

OWNER_EMAIL=you@example.com OWNER_PASSWORD=choose-a-strong-password npm run seed:owner
```

Then sign in at `/login`. Authenticated requests can reach `/admin/*`; everyone else is redirected to `/login`.

## RAWG API

Games are added by searching [RAWG](https://rawg.io/apidocs) and importing a title's data, rather than typed in by hand.

1. Create a free RAWG account and grab an API key from [rawg.io/apidocs](https://rawg.io/apidocs).
2. Set it as `RAWG_API_KEY` in `.env.local`. It's server-only — never exposed to the browser.

## Box art (SteamGridDB)

RAWG only provides promo screenshots, not real box/case art. Cover images are fetched from [SteamGridDB](https://www.steamgriddb.com/) instead, falling back to RAWG's image when there's no match.

1. Create a free account and grab an API key from [steamgriddb.com/profile/preferences/api](https://www.steamgriddb.com/profile/preferences/api).
2. Set it as `STEAMGRIDDB_API_KEY` in `.env.local`. Optional — if unset, games just use RAWG's image.

## Deploying (Vercel)

1. Push this repo to GitHub, then import it into [Vercel](https://vercel.com/new).
2. In the Vercel project's Environment Variables settings, add `DATABASE_URL` (your Neon connection string), `RAWG_API_KEY`, `STEAMGRIDDB_API_KEY`, and `SESSION_SECRET` — same values as `.env.local`.
3. Deploy. Vercel runs `npm run build` automatically.
4. Apply the schema to the production database once (from your machine, with `DATABASE_URL` pointed at the Neon prod branch): `npx drizzle-kit migrate`.
5. Run `npm run seed:owner` once (locally, pointed at the prod `DATABASE_URL`) to create your owner login on the production database.

After deploying, smoke-test the live site: browse the list page, open a game's detail page, log in, add a game, and post a comment.
