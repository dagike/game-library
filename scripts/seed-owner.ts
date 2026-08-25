import { config } from "dotenv";
config({ path: ".env.local" });

import { hashPassword } from "../lib/auth/password";

async function main() {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;

  if (!email || !password) {
    console.error(
      "Set OWNER_EMAIL and OWNER_PASSWORD env vars before running this script, e.g.\n" +
        "  OWNER_EMAIL=you@example.com OWNER_PASSWORD=secret npm run seed:owner"
    );
    process.exit(1);
  }

  const { db } = await import("../lib/db/client");
  const { users } = await import("../lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const passwordHash = await hashPassword(password);

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing.length > 0) {
    await db.update(users).set({ passwordHash }).where(eq(users.email, email));
    console.log(`Updated password for existing owner account: ${email}`);
  } else {
    await db.insert(users).values({ email, passwordHash });
    console.log(`Created owner account: ${email}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
