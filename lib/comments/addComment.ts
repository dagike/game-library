"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { comments } from "@/lib/db/schema";

const RATE_LIMIT_WINDOW_MS = 30_000;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headersList.get("x-real-ip") ?? "unknown";
}

export async function addComment(formData: FormData) {
  const gameSlug = String(formData.get("gameSlug") ?? "");
  const gameId = Number(formData.get("gameId") ?? "");
  const authorName = String(formData.get("authorName") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const honeypot = String(formData.get("website") ?? "").trim();

  if (!gameSlug || !gameId) redirect("/");

  // Honeypot filled: pretend success, don't persist anything.
  if (honeypot) redirect(`/games/${gameSlug}`);

  if (!authorName || !body) {
    redirect(`/games/${gameSlug}?commentError=missing`);
  }

  const ipHash = hashIp(await getClientIp());

  const recentComment = await db
    .select({ id: comments.id })
    .from(comments)
    .where(
      and(
        eq(comments.commentIpHash, ipHash),
        gt(comments.createdAt, new Date(Date.now() - RATE_LIMIT_WINDOW_MS)),
      ),
    )
    .limit(1);

  if (recentComment.length > 0) {
    redirect(`/games/${gameSlug}?commentError=rate_limited`);
  }

  await db.insert(comments).values({
    gameId,
    authorName: authorName.slice(0, 100),
    body: body.slice(0, 2000),
    commentIpHash: ipHash,
  });

  redirect(`/games/${gameSlug}`);
}
