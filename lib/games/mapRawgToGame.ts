import type { RawgGameDetail } from "@/lib/rawg";
import type { games } from "@/lib/db/schema";

type NewGame = typeof games.$inferInsert;

export function mapRawgToGame(detail: RawgGameDetail): NewGame {
  return {
    rawgId: detail.id,
    slug: detail.slug,
    title: detail.name,
    coverImageUrl: detail.background_image,
    description: detail.description_raw || null,
    genres: detail.genres?.map((g) => g.name) ?? [],
    platforms: detail.platforms?.map((p) => p.platform.name) ?? [],
    releaseDate: detail.released,
    rawgRating: detail.rating != null ? detail.rating.toString() : null,
    rawgMetadata: detail,
  };
}
