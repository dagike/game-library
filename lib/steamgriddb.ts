import "server-only";

const STEAMGRIDDB_BASE_URL = "https://www.steamgriddb.com/api/v2";

function getApiKey(): string | null {
  return process.env.STEAMGRIDDB_API_KEY || null;
}

type SteamGridDbSearchResponse = {
  success: boolean;
  data: { id: number; name: string }[];
};

type SteamGridDbGridsResponse = {
  success: boolean;
  data: { url: string }[];
};

/** Portrait box-art cover for a game title, or null if unavailable/no API key/no match. */
export async function getBoxArtUrl(title: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const headers = { Authorization: `Bearer ${apiKey}` };

  try {
    const searchRes = await fetch(
      `${STEAMGRIDDB_BASE_URL}/search/autocomplete/${encodeURIComponent(title)}`,
      { headers, cache: "no-store" }
    );
    if (!searchRes.ok) return null;

    const search = (await searchRes.json()) as SteamGridDbSearchResponse;
    const gameId = search.data?.[0]?.id;
    if (!gameId) return null;

    const gridsRes = await fetch(
      `${STEAMGRIDDB_BASE_URL}/grids/game/${gameId}?dimensions=600x900`,
      { headers, cache: "no-store" }
    );
    if (!gridsRes.ok) return null;

    const grids = (await gridsRes.json()) as SteamGridDbGridsResponse;
    return grids.data?.[0]?.url ?? null;
  } catch {
    return null;
  }
}
