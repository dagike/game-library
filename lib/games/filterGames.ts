// Pure filtering/sorting logic, deliberately free of any server-only or DB
// imports so it can run both server- and client-side (used by GameLibrary
// for instant, client-side real-time search/filter).

export type FilterableGame = {
  title: string;
  genres: string[];
  platforms: string[];
  starRating: number | null;
  manualRank: number | null;
};

export type GameListFilters = {
  q?: string;
  genre?: string;
  platform?: string;
  stars?: string;
  sort?: "rank" | "stars";
};

export function filterAndSortGames<T extends FilterableGame>(games: T[], filters: GameListFilters): T[] {
  let filtered = games;

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

  return [...filtered].sort((a, b) => {
    if (filters.sort === "stars") return compareByStars(a, b);

    // Default: my ranking first (ascending), then fall back to star rating
    // for anything I haven't ranked yet.
    const aRanked = a.manualRank != null;
    const bRanked = b.manualRank != null;
    if (aRanked && bRanked) return a.manualRank! - b.manualRank!;
    if (aRanked !== bRanked) return aRanked ? -1 : 1;
    return compareByStars(a, b);
  });
}

function compareByStars(a: FilterableGame, b: FilterableGame): number {
  if (a.starRating == null && b.starRating == null) return 0;
  if (a.starRating == null) return 1;
  if (b.starRating == null) return -1;
  return b.starRating - a.starRating;
}
