// /src/lib/redis.ts
import { createClient } from "redis";

// Create a singleton instance
const getRedisClient = (() => {
  let client: ReturnType<typeof createClient> | null = null;

  return async () => {
    if (client === null) {
      // Create new client with your Redis Cloud configuration
      client = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || "17196"),
        },
      });

      // Error handling
      client.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });

      client.on("connect", () => {
        console.log("Redis Client Connected");
      });

      await client.connect();
    }

    return client;
  };
})();

export { getRedisClient };
