# game-library

A personal web app for showing off favorite game titles: a public list of quick-view cards (cover, title, star rating) with search and filters, plus a detail page per game with full info, a personal rating and ranking, personal notes, and open public comments.

- **Stack**: Next.js (App Router, TypeScript), Tailwind CSS, Postgres (Neon) via Drizzle ORM, deployed on Vercel.
- **Game data**: imported from the [RAWG API](https://rawg.io/apidocs) rather than typed in by hand.
- **Access**: anyone can browse and comment; only the site owner (a single seeded account) can add/edit/delete games.

This app is being built incrementally — see the project plan for the full milestone breakdown. Setup instructions (database, RAWG key, owner account) will be added here as those pieces land.

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL (see below)
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
