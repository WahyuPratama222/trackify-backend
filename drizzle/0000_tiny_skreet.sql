CREATE TYPE "public"."bus_type" AS ENUM('campus');--> statement-breakpoint
CREATE TYPE "public"."direction" AS ENUM('forward', 'reverse');--> statement-breakpoint
CREATE TYPE "public"."trip_status" AS ENUM('ongoing', 'finished');--> statement-breakpoint
CREATE TABLE "buses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "bus_type" DEFAULT 'campus' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stop_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"stop_id" integer NOT NULL,
	"direction" "direction" NOT NULL,
	"seq" integer NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"radius_m" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stops" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" serial PRIMARY KEY NOT NULL,
	"bus_id" integer NOT NULL,
	"direction" "direction" NOT NULL,
	"status" "trip_status" DEFAULT 'ongoing' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "stop_points" ADD CONSTRAINT "stop_points_stop_id_stops_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."stops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_bus_id_buses_id_fk" FOREIGN KEY ("bus_id") REFERENCES "public"."buses"("id") ON DELETE no action ON UPDATE no action;