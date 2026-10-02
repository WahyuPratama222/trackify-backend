import { eq } from "drizzle-orm";
import { db } from "../db";
import { stops, stopPoints } from "../db/schema";

export const StopService = {
  async list() {
    const allStops = await db.select().from(stops);
    const allPoints = await db.select().from(stopPoints);

    return allStops.map((stop) => {
      const forward = allPoints.find(
        (p) => p.stopId === stop.id && p.direction === "forward"
      );
      const reverse = allPoints.find(
        (p) => p.stopId === stop.id && p.direction === "reverse"
      );

      return {
        id: stop.id,
        name: stop.name,
        seq: { forward: forward?.seq, reverse: reverse?.seq },
        points: {
          forward: forward && { lat: forward.lat, lng: forward.lng },
          reverse: reverse && { lat: reverse.lat, lng: reverse.lng },
        },
      };
    });
  },
};