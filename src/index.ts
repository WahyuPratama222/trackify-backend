import { Elysia } from "elysia";
import { health } from "./health";
import { trips } from "./trips";
import { locations } from "./locations";
import { buses } from "./buses";
import { stops } from "./stops";

const app = new Elysia()
  .get("/", () => "Trackify is running! ⚡")
  .use(health)
  .group("/api", (app) =>
    app.use(trips).use(locations).use(buses).use(stops)
  )
  .listen(3000);
console.log(
  `Trackify running at http://${app.server?.hostname}:${app.server?.port}`
);
