import { t } from "elysia";

export const locationBody = t.Object({
  tripId: t.Numeric(),
  lat: t.Number(),
  lng: t.Number(),
});

export const busParams = t.Object({
  busId: t.Numeric(),
});