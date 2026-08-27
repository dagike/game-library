import { redirect } from "next/navigation";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { games } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";
import { logout } from "@/app/login/actions";
import { StarRating } from "@/components/StarRating";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const allGames = await db.select().from(games).orderBy(asc(games.title));

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-4 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <Link href="/" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
          ← Back to library
        </Link>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as {user.email}.</p>

      <div className="flex gap-2">
        <Link
          href="/admin/games/new"
          className="rounded bg-gray-900 px-3 py-2 text-center text-sm text-white dark:bg-gray-100 dark:text-gray-900"
        >
          Add a game
        </Link>
        <form action={logout}>
          <button type="submit" className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700">
            Log out
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Your games</h2>
        {allGames.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No games yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
            {allGames.map((game) => (
              <li key={game.id} className="flex items-center justify-between gap-4 py-2">
                <div className="flex flex-col">
                  <Link href={`/games/${game.slug}`} className="text-sm hover:underline">
                    {game.title}
                  </Link>
                  <StarRating rating={game.starRating} />
                </div>
                <Link
                  href={`/admin/games/${game.slug}/edit`}
                  className="shrink-0 rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
