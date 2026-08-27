import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getGameBySlug } from "@/lib/games/getGameBySlug";
import { updateGame, deleteGame } from "./actions";
import { DeleteGameButton } from "./delete-button";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit {game.title}</h1>
        <Link href={`/games/${game.slug}`} className="text-sm text-gray-500 hover:underline dark:text-gray-400">
          Cancel
        </Link>
      </div>

      <form action={updateGame} className="flex flex-col gap-4">
        <input type="hidden" name="slug" value={game.slug} />

        <label className="flex flex-col gap-1 text-sm">
          Star rating
          <select
            name="starRating"
            defaultValue={game.starRating ?? ""}
            className="rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="">Not rated</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          My ranking (lower is better, leave blank for unranked)
          <input
            type="number"
            name="manualRank"
            min={1}
            defaultValue={game.manualRank ?? ""}
            className="rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          My thoughts
          <textarea
            name="ownerReview"
            rows={5}
            defaultValue={game.ownerReview ?? ""}
            className="rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </label>

        <button
          type="submit"
          className="rounded bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 dark:bg-primary-400 dark:text-gray-950 dark:hover:bg-primary-300"
        >
          Save
        </button>
      </form>

      <form
        action={deleteGame}
        className="border-t border-gray-200 pt-4 dark:border-gray-800"
      >
        <input type="hidden" name="slug" value={game.slug} />
        <DeleteGameButton title={game.title} />
      </form>
    </main>
  );
}
