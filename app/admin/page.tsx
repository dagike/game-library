import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { logout } from "@/app/login/actions";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Signed in as {user.email}. Game management tools will live here.
      </p>
      <form action={logout}>
        <button type="submit" className="rounded border border-gray-300 px-3 py-2 dark:border-gray-700">
          Log out
        </button>
      </form>
    </main>
  );
}
