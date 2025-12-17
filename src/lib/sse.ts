import { getRedisClient } from "./redis"

/**
 * Broadcast an update event to all clients subscribed to a group via Redis pub/sub
 * Clients will refresh their data when they receive this event
 */
export function broadcast(groupId: string) {
  const redis = getRedisClient()
  const channel = `sse:${groupId}`
  const message = JSON.stringify({ event: "update", data: {} })

  redis.publish(channel, message).catch(err => {
    console.error(`Failed to publish to Redis channel ${channel}:`, err)
  })
}
