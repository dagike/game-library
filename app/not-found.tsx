import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-3 px-4 text-center animate-fade-in-up">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link href="/" className="text-sm underline">
        Back to the library
      </Link>
    </main>
  );
}
