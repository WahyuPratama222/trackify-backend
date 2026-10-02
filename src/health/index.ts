import { Elysia } from "elysia";
import { HealthService } from "./service";

export const health = new Elysia().get("/health", async ({ set }) => {
  const { ok, body } = await HealthService.check();
  // 503 so Docker or a load balancer can tell the service is unhealthy
  if (!ok) set.status = 503;
  return body;
});