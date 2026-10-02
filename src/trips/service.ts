import { eq, and } from "drizzle-orm";
import { db } from "./../db";
import { trips } from "./../db/schema";

// Postgres unique violation code (drizzle may wrap the original error in `cause`)
function isUniqueViolation(err: any) {
  return (err?.code ?? err?.cause?.code) === "23505";
}

export const TripService = {
  async start(busId: number, direction: "forward" | "reverse") {
    // Friendly early check; the DB index below is the real guarantee
    const [active] = await db
      .select()
      .from(trips)
      .where(and(eq(trips.busId, busId), eq(trips.status, "ongoing")));

    if (active) throw new Error("Bus already has an active trip");

    try {
      const [trip] = await db
        .insert(trips)
        .values({ busId, direction })
        .returning();
      return trip;
    } catch (err) {
      // Two concurrent requests passed the check above; the index rejected one
      if (isUniqueViolation(err)) {
        throw new Error("Bus already has an active trip");
      }
      throw err;
    }
  },

  async finish(busId: number, tripId: number) {
    const [trip] = await db
      .select()
      .from(trips)
      .where(and(eq(trips.id, tripId), eq(trips.busId, busId)));

    if (!trip) throw new Error("Trip not found");
    if (trip.status === "finished") throw new Error("Trip already finished");

    // Only update if still ongoing, so concurrent finishes can't overwrite finishedAt
    const [updated] = await db
      .update(trips)
      .set({ status: "finished", finishedAt: new Date() })
      .where(and(eq(trips.id, tripId), eq(trips.status, "ongoing")))
      .returning();

    if (!updated) throw new Error("Trip already finished");

    return updated;
  },
};