import Redis from "ioredis"

let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.REDIS_URL || "redis://localhost:6379"
    redis = new Redis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: times => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      lazyConnect: true,
    })

    redis.on("error", err => {
      console.error("Redis error:", err)
    })

    redis.on("connect", () => {
      console.log("Redis connected")
    })

    // Attempt to connect, but don't fail if it doesn't
    redis.connect().catch(err => {
      console.warn("Redis connection failed, will retry:", err.message)
    })
  }

  return redis
}
