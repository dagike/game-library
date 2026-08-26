export function StarRating({ rating }: { rating: number | null }) {
  if (rating == null) {
    return <span className="text-sm text-gray-400 dark:text-gray-600">Not yet rated</span>;
  }

  return (
    <span aria-label={`${rating} out of 5 stars`} className="text-amber-500">
      {"★".repeat(rating)}
      <span className="text-gray-300 dark:text-gray-700">{"★".repeat(5 - rating)}</span>
    </span>
  );
}
