import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  doublePrecision,
  timestamp,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const busType = pgEnum("bus_type", ["campus"]);
export const direction = pgEnum("direction", ["forward", "reverse"]);
export const tripStatus = pgEnum("trip_status", ["ongoing", "finished"]);

// --- Buses ---
export const buses = pgTable("buses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: busType("type").notNull().default("campus"),
});

// --- Stops (12 logical stops) ---
export const stops = pgTable("stops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g. "Fakultas 4"
});

// --- Stop points (24 physical points: one per stop per direction) ---
export const stopPoints = pgTable("stop_points", {
  id: serial("id").primaryKey(),
  stopId: integer("stop_id")
    .notNull()
    .references(() => stops.id),
  direction: direction("direction").notNull(),
  seq: integer("seq").notNull(), // order along the route, per direction
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  radiusM: integer("radius_m").notNull(),
});

// --- Trips (one row per forward/reverse run) ---
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  busId: integer("bus_id")
    .notNull()
    .references(() => buses.id),
  direction: direction("direction").notNull(),
  status: tripStatus("status").notNull().default("ongoing"),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }), // null while ongoing
});