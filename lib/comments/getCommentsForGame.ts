import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { comments } from "@/lib/db/schema";

export async function getCommentsForGame(gameId: number) {
  return db
    .select()
    .from(comments)
    .where(eq(comments.gameId, gameId))
    .orderBy(desc(comments.createdAt));
}
