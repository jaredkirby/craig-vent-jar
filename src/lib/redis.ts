// /src/lib/redis.ts

import { createClient } from "redis";

// Create a singleton instance
const getRedisClient = (() => {
  let client: ReturnType<typeof createClient> | null = null;

  return async () => {
    if (client === null) {
      // Create new client if none exists
      client = createClient({
        url: process.env.REDIS_URL,
        socket: {
          reconnectStrategy(retries) {
            // Attempt to reconnect up to 20 times with increasing delay
            if (retries > 20) {
              console.error("Too many Redis connection attempts, giving up");
              return new Error("Too many retries");
            }
            return Math.min(retries * 100, 3000); // Maximum 3s delay
          },
          connectTimeout: 10000, // 10s timeout
        },
      });

      // Error handling
      client.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });

      // Connection status logging
      client.on("connect", () => {
        console.log("Redis Client Connected");
      });

      client.on("reconnecting", () => {
        console.log("Redis Client Reconnecting");
      });

      await client.connect();
    }

    return client;
  };
})();

export { getRedisClient };
