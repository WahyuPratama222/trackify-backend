import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { trips } from "../db/schema";
import { redis } from "../redis";

export const LocationService = {
  async update(busId: number, tripId: number, lat: number, lng: number) {
    // Validate the trip belongs to this bus and is still ongoing
    const [trip] = await db
      .select()
      .from(trips)
      .where(and(eq(trips.id, tripId), eq(trips.busId, busId)));

    if (!trip) throw new Error("Trip not found");
    if (trip.status !== "ongoing") throw new Error("Trip is not ongoing");

    // Store the current position as a geo point, keyed by bus id
    await redis.geoadd("buses:location", lng, lat, String(busId));

    // Store metadata separately, since geo keys can't hold extra fields
    await redis.hset(`bus:${busId}:meta`, {
      tripId,
      direction: trip.direction,
      lat,
      lng,
      updatedAt: new Date().toISOString(),
    });

    return { busId, tripId, lat, lng, recordedAt: new Date().toISOString() };
  },
};