"use client";

export function DeleteGameButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(`Delete "${title}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
      className="rounded border border-red-300 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:text-red-400"
    >
      Delete this game
    </button>
  );
}
