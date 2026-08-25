import "server-only";

const RAWG_BASE_URL = "https://api.rawg.io/api";

function getApiKey() {
  const key = process.env.RAWG_API_KEY;
  if (!key) throw new Error("RAWG_API_KEY environment variable is not set");
  return key;
}

export type RawgSearchResult = {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  released: string | null;
  rating: number;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[] | null;
};

export type RawgGameDetail = RawgSearchResult & {
  description_raw: string;
};

export async function searchGames(query: string): Promise<RawgSearchResult[]> {
  const url = new URL(`${RAWG_BASE_URL}/games`);
  url.searchParams.set("key", getApiKey());
  url.searchParams.set("search", query);
  url.searchParams.set("page_size", "10");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`RAWG search failed: ${res.status}`);

  const data = await res.json();
  return data.results as RawgSearchResult[];
}

export async function getGameById(rawgId: number): Promise<RawgGameDetail> {
  const url = new URL(`${RAWG_BASE_URL}/games/${rawgId}`);
  url.searchParams.set("key", getApiKey());

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`RAWG get game failed: ${res.status}`);

  return (await res.json()) as RawgGameDetail;
}
