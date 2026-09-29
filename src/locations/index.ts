import { Elysia } from "elysia";
import { LocationService } from "./service";
import { locationBody, busParams } from "./model";

export const locations = new Elysia({ prefix: "/buses/:busId" })
  .post(
    "/location",
    async ({ params, body, set }) => {
      try {
        return await LocationService.update(
          params.busId,
          body.tripId,
          body.lat,
          body.lng
        );
      } catch (err) {
        set.status = 409;
        return { error: (err as Error).message };
      }
    },
    { params: busParams, body: locationBody }
  );