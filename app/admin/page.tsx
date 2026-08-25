import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { logout } from "@/app/login/actions";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as {user.email}.</p>
      <Link
        href="/admin/games/new"
        className="rounded bg-gray-900 px-3 py-2 text-center text-sm text-white dark:bg-gray-100 dark:text-gray-900"
      >
        Add a game
      </Link>
      <form action={logout}>
        <button type="submit" className="rounded border border-gray-300 px-3 py-2 dark:border-gray-700">
          Log out
        </button>
      </form>
    </main>
  );
}
