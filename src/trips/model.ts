import { t } from "elysia";

export const startTripBody = t.Object({
  direction: t.Union([t.Literal("forward"), t.Literal("reverse")]),
});

export const tripParams = t.Object({
  busId: t.Numeric(),
});

export const finishTripParams = t.Object({
  busId: t.Numeric(),
  tripId: t.Numeric(),
});