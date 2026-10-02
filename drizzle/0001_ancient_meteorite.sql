CREATE UNIQUE INDEX "trips_one_ongoing_per_bus" ON "trips" USING btree ("bus_id") WHERE "trips"."status" = 'ongoing';--> statement-breakpoint
ALTER TABLE "stop_points" ADD CONSTRAINT "stop_points_stop_direction" UNIQUE("stop_id","direction");--> statement-breakpoint
ALTER TABLE "stop_points" ADD CONSTRAINT "stop_points_direction_seq" UNIQUE("direction","seq");