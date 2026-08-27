import { db } from "@/lib/db/client";
import { games } from "@/lib/db/schema";

/** All games plus the genre/platform facets available across the library.
 *  Filtering/sorting happens client-side (see GameLibrary) for real-time
 *  search without a server round-trip per keystroke. */
export async function getGameLibrary() {
  const rows = await db.select().from(games);

  const genreSet = new Set<string>();
  const platformSet = new Set<string>();
  for (const row of rows) {
    row.genres.forEach((g) => genreSet.add(g));
    row.platforms.forEach((p) => platformSet.add(p));
  }

  return {
    games: rows,
    genres: [...genreSet].sort(),
    platforms: [...platformSet].sort(),
  };
}
