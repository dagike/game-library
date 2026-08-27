"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { games } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getGameById } from "@/lib/rawg";
import { mapRawgToGame } from "@/lib/games/mapRawgToGame";
import { getBoxArtUrl } from "@/lib/steamgriddb";

export async function addGame(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rawgId = Number(formData.get("rawgId"));
  if (!rawgId) redirect("/admin/games/new?error=missing");

  const [existing] = await db
    .select({ id: games.id })
    .from(games)
    .where(eq(games.rawgId, rawgId))
    .limit(1);
  if (existing) redirect("/admin/games/new?error=duplicate");

  const detail = await getGameById(rawgId);
  const newGame = mapRawgToGame(detail);

  const boxArtUrl = await getBoxArtUrl(detail.name);
  if (boxArtUrl) newGame.coverImageUrl = boxArtUrl;

  await db.insert(games).values(newGame);

  redirect(`/admin/games/new?added=${encodeURIComponent(newGame.title)}`);
}
