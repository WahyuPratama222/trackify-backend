import { Elysia } from "elysia";
import { TripsService } from "./service";
import { startTripBody, tripParams, finishTripParams } from "./model";

export const trips = new Elysia({ prefix: "/buses/:busId/trips" })
  .post(
    "/start",
    async ({ params, body, set }) => {
      try {
        return await TripsService.start(params.busId, body.direction);
      } catch (err) {
        set.status = 409;
        return { error: (err as Error).message };
      }
    },
    { params: tripParams, body: startTripBody }
  )
  .post(
    "/:tripId/finish",
    async ({ params, set }) => {
      try {
        return await TripsService.finish(params.busId, params.tripId);
      } catch (err) {
        set.status = err instanceof Error && err.message === "Trip not found" ? 404 : 409;
        return { error: (err as Error).message };
      }
    },
    { params: finishTripParams }
  );