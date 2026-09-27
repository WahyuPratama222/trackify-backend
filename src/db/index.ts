import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Bun loads DATABASE_URL from .env automatically
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });