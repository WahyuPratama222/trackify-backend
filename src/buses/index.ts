import { Elysia } from "elysia";
import { BusService } from "./service";
import { busParams } from "./model";

export const buses = new Elysia({ prefix: "/buses" })
  .get("/", () => BusService.list())
  .get(
    "/:busId",
    async ({ params, set }) => {
      try {
        return await BusService.getOne(params.busId);
      } catch (err) {
        set.status = 404;
        return { error: (err as Error).message };
      }
    },
    { params: busParams }
  );