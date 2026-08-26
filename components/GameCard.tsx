import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/StarRating";

type Game = {
  slug: string;
  title: string;
  coverImageUrl: string | null;
  starRating: number | null;
  manualRank: number | null;
};

export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group flex flex-col overflow-hidden rounded border border-gray-200 transition hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600"
    >
      <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-900">
        {game.coverImageUrl ? (
          <Image
            src={game.coverImageUrl}
            alt={game.title}
            fill
            unoptimized
            className="object-cover"
          />
        ) : null}
        {game.manualRank != null && (
          <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
            #{game.manualRank}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <p className="font-medium group-hover:underline">{game.title}</p>
        <StarRating rating={game.starRating} />
      </div>
    </Link>
  );
}
