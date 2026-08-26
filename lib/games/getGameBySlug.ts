import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { games } from "@/lib/db/schema";

export async function getGameBySlug(slug: string) {
  const [game] = await db.select().from(games).where(eq(games.slug, slug)).limit(1);
  return game ?? null;
}
