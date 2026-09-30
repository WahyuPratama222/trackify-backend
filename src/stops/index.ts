import { Elysia } from "elysia";
import { StopService } from "./service";

export const stops = new Elysia({ prefix: "/stops" })
  .get("/", () => StopService.list());