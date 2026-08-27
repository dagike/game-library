import { addComment } from "@/lib/comments/addComment";

const inputClasses =
  "rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900";

export function CommentForm({
  gameId,
  gameSlug,
  error,
}: {
  gameId: number;
  gameSlug: string;
  error?: string;
}) {
  return (
    <form action={addComment} className="flex flex-col gap-3">
      <input type="hidden" name="gameId" value={gameId} />
      <input type="hidden" name="gameSlug" value={gameSlug} />

      {/* Honeypot: hidden from real visitors, often filled in by bots */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error === "missing" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Please fill in your name and a comment.
        </p>
      )}
      {error === "rate_limited" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          You&apos;re commenting too quickly — please wait a moment and try again.
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Name
        <input type="text" name="authorName" required maxLength={100} className={inputClasses} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Comment
        <textarea name="body" required rows={3} maxLength={2000} className={inputClasses} />
      </label>

      <button
        type="submit"
        className="w-fit rounded bg-primary-600 px-4 py-2 text-sm text-white transition hover:bg-primary-700 active:scale-95 dark:bg-primary-400 dark:text-gray-950 dark:hover:bg-primary-300"
      >
        Post comment
      </button>
    </form>
  );
}
