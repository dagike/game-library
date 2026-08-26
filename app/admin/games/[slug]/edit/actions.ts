"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { games } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function updateGame(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const slug = String(formData.get("slug") ?? "");
  if (!slug) redirect("/admin");

  const starRatingRaw = String(formData.get("starRating") ?? "");
  const manualRankRaw = String(formData.get("manualRank") ?? "");
  const ownerReviewRaw = String(formData.get("ownerReview") ?? "").trim();

  await db
    .update(games)
    .set({
      starRating: starRatingRaw ? Number(starRatingRaw) : null,
      manualRank: manualRankRaw ? Number(manualRankRaw) : null,
      ownerReview: ownerReviewRaw || null,
      updatedAt: new Date(),
    })
    .where(eq(games.slug, slug));

  redirect(`/games/${slug}`);
}

export async function deleteGame(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const slug = String(formData.get("slug") ?? "");
  if (!slug) redirect("/admin");

  await db.delete(games).where(eq(games.slug, slug));

  redirect("/admin");
}
