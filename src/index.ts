import { Elysia } from 'elysia';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { trips } from "./trips";
import { location } from './locations';

const app = new Elysia()
  .get('/', () => 'Trackify is running! ⚡')
  .get('/health', () => ({ status: 'ok' }))
  .use(trips)
  .use(location)
  .listen(3000);

const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient);

console.log(
  `Trackify running at http://${app.server?.hostname}:${app.server?.port}`
);
