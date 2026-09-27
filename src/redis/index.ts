import Redis from "ioredis";

// Bun loads REDIS_URL from .env automatically
export const redis = new Redis(process.env.REDIS_URL!);