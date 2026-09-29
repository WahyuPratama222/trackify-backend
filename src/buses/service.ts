import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { buses, trips } from "../db/schema";
import { redis } from "../redis";

const OFFLINE_THRESHOLD_MS = 30_000;

function buildBusInfo(bus: typeof buses.$inferSelect, meta: Record<string, string>) {
  const updatedAt = meta.updatedAt;
  const isStale = !updatedAt || Date.now() - new Date(updatedAt).getTime() > OFFLINE_THRESHOLD_MS;

  return {
    busId: bus.id,
    type: bus.type,
    tripId: Number(meta.tripId),
    direction: meta.direction,
    lat: Number(meta.lat),
    lng: Number(meta.lng),
    lastUpdatedAt: updatedAt ?? null,
    status: isStale ? "offline" : "moving",
  };
}

export const BusService = {
  async list() {
    // Only buses with an ongoing trip are relevant
    const ongoing = await db
      .select()
      .from(trips)
      .innerJoin(buses, eq(trips.busId, buses.id))
      .where(eq(trips.status, "ongoing"));

    const result = [];
    for (const row of ongoing) {
      const meta = await redis.hgetall(`bus:${row.buses.id}:meta`);
      if (Object.keys(meta).length === 0) continue; // no location sent yet
      result.push(buildBusInfo(row.buses, meta));
    }
    return result;
  },

  async getOne(busId: number) {
    const [row] = await db
      .select()
      .from(trips)
      .innerJoin(buses, eq(trips.busId, buses.id))
      .where(and(eq(buses.id, busId), eq(trips.status, "ongoing")));

    if (!row) throw new Error("Bus not found or has no active trip");

    const meta = await redis.hgetall(`bus:${busId}:meta`);
    if (Object.keys(meta).length === 0) throw new Error("Bus not found or has no active trip");

    return buildBusInfo(row.buses, meta);
  },
};