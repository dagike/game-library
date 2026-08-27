import type { comments as commentsTable } from "@/lib/db/schema";
import { deleteComment } from "@/lib/comments/deleteComment";

type Comment = typeof commentsTable.$inferSelect;

export function CommentList({
  comments,
  gameSlug,
  canModerate,
}: {
  comments: Comment[];
  gameSlug: string;
  canModerate: boolean;
}) {
  if (comments.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment) => (
        <li key={comment.id} className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium">{comment.authorName}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.createdAt.toLocaleDateString()}
              </span>
              {canModerate && (
                <form action={deleteComment}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="gameSlug" value={gameSlug} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </form>
              )}
            </div>
          </div>
          <p className="mt-1 whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
            {comment.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
