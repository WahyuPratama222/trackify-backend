import { eq, and } from "drizzle-orm";
import { db } from "./../db";
import { trips } from "./../db/schema";

export const TripsService = {
  async start(busId: number, direction: "forward" | "reverse") {
    // Reject if this bus already has an ongoing trip
    const [active] = await db
      .select()
      .from(trips)
      .where(and(eq(trips.busId, busId), eq(trips.status, "ongoing")));

    if (active) {
      throw new Error("Bus already has an active trip");
    }

    const [trip] = await db
      .insert(trips)
      .values({ busId, direction })
      .returning();

    return trip;
  },

  async finish(busId: number, tripId: number) {
    const [trip] = await db
      .select()
      .from(trips)
      .where(and(eq(trips.id, tripId), eq(trips.busId, busId)));

    if (!trip) throw new Error("Trip not found");
    if (trip.status === "finished") throw new Error("Trip already finished");

    const [updated] = await db
      .update(trips)
      .set({ status: "finished", finishedAt: new Date() })
      .where(eq(trips.id, tripId))
      .returning();

    return updated;
  },
};