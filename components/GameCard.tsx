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

export function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className="group flex animate-fade-in-up flex-col overflow-hidden rounded border border-gray-200 transition hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg dark:border-gray-800 dark:hover:border-primary-600 dark:hover:shadow-primary-950/40"
    >
      <div className="relative aspect-[2/3] w-full bg-gray-100 dark:bg-gray-900">
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
        <p className="font-medium transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
          {game.title}
        </p>
        <StarRating rating={game.starRating} />
      </div>
    </Link>
  );
}
