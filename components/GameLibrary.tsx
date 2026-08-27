"use client";

import { useEffect, useMemo, useState } from "react";
import type { games as gamesTable } from "@/lib/db/schema";
import { GameCard } from "@/components/GameCard";
import { filterAndSortGames, type GameListFilters } from "@/lib/games/filterGames";

type Game = typeof gamesTable.$inferSelect;

const SEARCH_DEBOUNCE_MS = 250;

export function GameLibrary({
  games,
  genres,
  platforms,
  initial,
}: {
  games: Game[];
  genres: string[];
  platforms: string[];
  initial: GameListFilters;
}) {
  const [qInput, setQInput] = useState(initial.q ?? "");
  const [q, setQ] = useState(qInput);
  const [genre, setGenre] = useState(initial.genre ?? "");
  const [platform, setPlatform] = useState(initial.platform ?? "");
  const [stars, setStars] = useState(initial.stars ?? "");
  const [sort, setSort] = useState<NonNullable<GameListFilters["sort"]>>(
    initial.sort === "rank" ? "rank" : "stars",
  );

  // Debounce only the free-text field so the grid (and URL) settle shortly
  // after typing stops, instead of refiltering on every keystroke. Selects
  // apply instantly since they're discrete choices, not a fast keystream.
  useEffect(() => {
    const id = setTimeout(() => setQ(qInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [qInput]);

  const filters = useMemo<GameListFilters>(
    () => ({ q, genre, platform, stars, sort }),
    [q, genre, platform, stars, sort],
  );

  const filteredGames = useMemo(() => filterAndSortGames(games, filters), [games, filters]);

  // Keep the URL shareable/bookmarkable without a server round-trip per change.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.genre) params.set("genre", filters.genre);
    if (filters.platform) params.set("platform", filters.platform);
    if (filters.stars) params.set("stars", filters.stars);
    if (filters.sort !== "stars") params.set("sort", filters.sort!);
    const query = params.toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [filters]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 rounded border border-gray-200 p-3 dark:border-gray-800">
        <input
          type="text"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          placeholder="Search titles..."
          className="min-w-[160px] flex-1 rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded border border-gray-300 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded border border-gray-300 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">All platforms</option>
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={stars}
          onChange={(e) => setStars(e.target.value)}
          className="rounded border border-gray-300 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value === "rank" ? "rank" : "stars")}
          className="rounded border border-gray-300 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="stars">Sort by star rating</option>
          <option value="rank">Sort by my ranking</option>
        </select>
      </div>

      {filteredGames.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">No games match those filters yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
