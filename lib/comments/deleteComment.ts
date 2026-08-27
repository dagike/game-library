"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { comments } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function deleteComment(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const commentId = Number(formData.get("commentId"));
  const gameSlug = String(formData.get("gameSlug") ?? "");
  if (!commentId || !gameSlug) redirect("/");

  await db.delete(comments).where(eq(comments.id, commentId));

  redirect(`/games/${gameSlug}`);
}
