import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { GameSearch } from "./game-search";

export default async function NewGamePage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { added, error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Add a game</h1>
        <Link href="/admin" className="text-sm text-gray-600 underline dark:text-gray-400">
          Back to admin
        </Link>
      </div>

      {added && (
        <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
          Added &ldquo;{added}&rdquo;.
        </p>
      )}
      {error === "duplicate" && (
        <p className="rounded bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
          That game is already in your library.
        </p>
      )}
      {error === "missing" && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
          Something went wrong adding that game.
        </p>
      )}

      <GameSearch />
    </main>
  );
}
