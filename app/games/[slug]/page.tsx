import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameBySlug } from "@/lib/games/getGameBySlug";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getCommentsForGame } from "@/lib/comments/getCommentsForGame";
import { StarRating } from "@/components/StarRating";
import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ commentError?: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const { commentError } = await searchParams;
  const [user, comments] = await Promise.all([getCurrentUser(), getCommentsForGame(game.id)]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10 animate-fade-in-up">
      <Link
        href="/"
        className="text-sm text-gray-500 transition-colors hover:text-primary-600 hover:underline dark:text-gray-400 dark:hover:text-primary-400"
      >
        ← Back to library
      </Link>

      {game.coverImageUrl && (
        <div className="relative aspect-[2/3] w-full max-w-xs overflow-hidden rounded bg-gray-100 dark:bg-gray-900">
          <Image src={game.coverImageUrl} alt={game.title} fill unoptimized className="object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{game.title}</h1>
          <div className="mt-1 flex items-center gap-3">
            <StarRating rating={game.starRating} />
            {game.manualRank != null && (
              <span className="text-sm text-gray-500 dark:text-gray-400">Rank #{game.manualRank}</span>
            )}
          </div>
        </div>
        {user && (
          <Link
            href={`/admin/games/${game.slug}/edit`}
            className="shrink-0 rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700"
          >
            Edit
          </Link>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Released</dt>
          <dd>{game.releaseDate ?? "Unknown"}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">RAWG rating</dt>
          <dd>{game.rawgRating ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Genres</dt>
          <dd>{game.genres.length ? game.genres.join(", ") : "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Platforms</dt>
          <dd>{game.platforms.length ? game.platforms.join(", ") : "—"}</dd>
        </div>
      </dl>

      {game.description && (
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">About</h2>
          <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
            {game.description}
          </p>
        </div>
      )}

      {game.ownerReview && (
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">My thoughts</h2>
          <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
            {game.ownerReview}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
        <h2 className="text-lg font-medium">Comments</h2>
        <CommentList comments={comments} gameSlug={game.slug} canModerate={Boolean(user)} />
        <div className="relative">
          <CommentForm gameId={game.id} gameSlug={game.slug} error={commentError} />
        </div>
      </div>
    </main>
  );
}
