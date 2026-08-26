import { db } from "@/lib/db/client";
import { games } from "@/lib/db/schema";

export type GameListFilters = {
  q?: string;
  genre?: string;
  platform?: string;
  stars?: string;
  sort?: "rank" | "stars";
};

export async function getGameLibrary(filters: GameListFilters) {
  const rows = await db.select().from(games);

  const genreSet = new Set<string>();
  const platformSet = new Set<string>();
  for (const row of rows) {
    row.genres.forEach((g) => genreSet.add(g));
    row.platforms.forEach((p) => platformSet.add(p));
  }

  let filtered = rows;

  if (filters.q) {
    const q = filters.q.toLowerCase();
    filtered = filtered.filter((g) => g.title.toLowerCase().includes(q));
  }
  if (filters.genre) {
    filtered = filtered.filter((g) => g.genres.includes(filters.genre!));
  }
  if (filters.platform) {
    filtered = filtered.filter((g) => g.platforms.includes(filters.platform!));
  }
  if (filters.stars) {
    const stars = Number(filters.stars);
    filtered = filtered.filter((g) => g.starRating === stars);
  }

  const sorted = [...filtered].sort((a, b) => {
    if (filters.sort === "rank") {
      if (a.manualRank == null) return 1;
      if (b.manualRank == null) return -1;
      return a.manualRank - b.manualRank;
    }
    if (a.starRating == null) return 1;
    if (b.starRating == null) return -1;
    return b.starRating - a.starRating;
  });

  return {
    games: sorted,
    genres: [...genreSet].sort(),
    platforms: [...platformSet].sort(),
  };
}
