"use client";

import { useState } from "react";
import Image from "next/image";
import { addGame } from "./actions";

type SearchResult = {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  released: string | null;
  rating: number;
};

export function GameSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rawg/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results);
    } catch {
      setError("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search RAWG for a game title..."
          className="flex-1 rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="flex flex-col gap-3">
        {results.map((result) => (
          <li
            key={result.id}
            className="flex items-center gap-4 rounded border border-gray-200 p-3 dark:border-gray-800"
          >
            {result.background_image ? (
              <Image
                src={result.background_image}
                alt={result.name}
                width={80}
                height={45}
                className="h-[45px] w-[80px] rounded object-cover"
                unoptimized
              />
            ) : (
              <div className="h-[45px] w-[80px] shrink-0 rounded bg-gray-200 dark:bg-gray-800" />
            )}
            <div className="flex-1">
              <p className="font-medium">{result.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {result.released ?? "Unknown release date"} · RAWG rating {result.rating}
              </p>
            </div>
            <form action={addGame}>
              <input type="hidden" name="rawgId" value={result.id} />
              <button
                type="submit"
                className="rounded border border-primary-300 px-3 py-1.5 text-sm text-primary-700 transition-colors hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-950"
              >
                Add
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
