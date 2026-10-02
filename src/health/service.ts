import { sql } from "drizzle-orm";
import { db } from "../db";
import { redis } from "../redis";

const CHECK_TIMEOUT_MS = 2_000;

// Reject if a check takes too long, so /health never hangs like a stuck request
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

async function check(fn: () => Promise<unknown>): Promise<"up" | "down"> {
  try {
    await withTimeout(fn(), CHECK_TIMEOUT_MS);
    return "up";
  } catch {
    return "down";
  }
}

export const HealthService = {
  async check() {
    // Run both checks in parallel
    const [database, cache] = await Promise.all([
      check(() => db.execute(sql`SELECT 1`)),
      check(() => redis.ping()),
    ]);

    const ok = database === "up" && cache === "up";
    return {
      ok,
      body: {
        status: ok ? "ok" : "degraded",
        checks: { database, redis: cache },
      },
    };
  },
};