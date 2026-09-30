import { Elysia } from "elysia";
import { trips } from "./trips";
import { locations } from "./locations";
import { buses } from "./buses";
import { stops } from "./stops";

const app = new Elysia()
  .get("/", () => "Trackify is running! ⚡")
  .get("/health", () => ({ status: "ok" }))
  .use(trips)
  .use(locations)
  .use(buses)
  .use(stops)
  .listen(3000);

console.log(
  `Trackify running at http://${app.server?.hostname}:${app.server?.port}`
);
