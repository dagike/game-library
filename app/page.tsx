import Link from "next/link";
import { getGameLibrary } from "@/lib/games/queryGames";
import { getCurrentUser } from "@/lib/auth/current-user";
import { GameCard } from "@/components/GameCard";
import { GameFilters } from "@/components/GameFilters";

type SearchParams = {
  q?: string;
  genre?: string;
  platform?: string;
  stars?: string;
  sort?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const sort = params.sort === "rank" ? "rank" : "stars";

  const [user, { games, genres, platforms }] = await Promise.all([
    getCurrentUser(),
    getGameLibrary({
      q: params.q,
      genre: params.genre,
      platform: params.platform,
      stars: params.stars,
      sort,
    }),
  ]);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Game Library</h1>
        {user ? (
          <Link
            href="/admin"
            className="text-sm text-gray-500 transition-colors hover:text-primary-600 hover:underline dark:text-gray-400 dark:hover:text-primary-400"
          >
            Admin
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-sm text-gray-500 transition-colors hover:text-primary-600 hover:underline dark:text-gray-400 dark:hover:text-primary-400"
          >
            Sign in
          </Link>
        )}
      </div>

      <GameFilters genres={genres} platforms={platforms} current={{ ...params, sort }} />

      {games.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No games match those filters yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {games.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}
