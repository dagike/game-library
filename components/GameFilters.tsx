type Current = {
  q?: string;
  genre?: string;
  platform?: string;
  stars?: string;
  sort?: string;
};

export function GameFilters({
  genres,
  platforms,
  current,
}: {
  genres: string[];
  platforms: string[];
  current: Current;
}) {
  return (
    <form
      method="get"
      className="flex flex-wrap items-center gap-2 rounded border border-gray-200 p-3 dark:border-gray-800"
    >
      <input
        type="text"
        name="q"
        defaultValue={current.q ?? ""}
        placeholder="Search titles..."
        className="min-w-[160px] flex-1 rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
      />

      <select
        name="genre"
        defaultValue={current.genre ?? ""}
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
        name="platform"
        defaultValue={current.platform ?? ""}
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
        name="stars"
        defaultValue={current.stars ?? ""}
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
        name="sort"
        defaultValue={current.sort ?? "stars"}
        className="rounded border border-gray-300 px-2 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <option value="stars">Sort by star rating</option>
        <option value="rank">Sort by my ranking</option>
      </select>

      <button
        type="submit"
        className="rounded bg-primary-600 px-4 py-2 text-sm text-white transition hover:bg-primary-700 active:scale-95 dark:bg-primary-400 dark:text-gray-950 dark:hover:bg-primary-300"
      >
        Apply
      </button>
    </form>
  );
}
