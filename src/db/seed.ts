import { db } from "./index";
import { buses, stops, stopPoints } from "./schema";

const FACULTY_NAMES = Array.from({ length: 10 }, (_, i) => `Fakultas ${i + 1}`);
const STOP_NAMES = ["Gerbang Kampus", ...FACULTY_NAMES, "Titik Akhir"];

async function seed() {
  console.log("Seeding buses...");
  await db.insert(buses).values({ name: "Bus 1", type: "campus" });

  console.log("Seeding stops...");

  for (let i = 0; i < STOP_NAMES.length; i++) {
    const [stop] = await db
      .insert(stops)
      .values({ name: STOP_NAMES[i] })
      .returning();

    // Placeholder coordinates — replace with real Google Maps values later.
    // Forward direction: seq follows stop order (1 to 12)
    await db.insert(stopPoints).values({
      stopId: stop.id,
      direction: "forward",
      seq: i + 1,
      lat: -6.0 - i * 0.001,
      lng: 106.0 + i * 0.001,
      radiusM: 30,
    });

    // Reverse direction: seq is mirrored (12 down to 1)
    await db.insert(stopPoints).values({
      stopId: stop.id,
      direction: "reverse",
      seq: STOP_NAMES.length - i,
      lat: -6.0001 - i * 0.001,
      lng: 106.0001 + i * 0.001,
      radiusM: 30,
    });
  }

  console.log(`Seeded 1 bus, ${STOP_NAMES.length} stops (${STOP_NAMES.length * 2} stop points).`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});