import { NextRequest } from "next/server"
import { nanoid } from "nanoid"
import { getRedisClient } from "@/lib/redis"
import type Redis from "ioredis"

export async function GET(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params

  const stream = new ReadableStream({
    start(controller) {
      const clientId = nanoid()
      const redis = getRedisClient().duplicate()
      const channel = `sse:${groupId}`

      // Subscribe to Redis channel for this group

      redis.subscribe(channel, err => {
        if (err) {
          console.error(`Failed to subscribe to ${channel}:`, err)
          controller.close()
          return
        }
        console.log(`Subscribed to Redis channel: ${channel}`)
      })

      const sendMessage = (data: string) => {
        try {
          controller.enqueue(new TextEncoder().encode(data))
        } catch (error) {
          console.error("Client disconnected", error)
          cleanup()
        }
      }

      sendMessage(`event: connected\ndata: ${JSON.stringify({ connected: true, clientId })}\n\n`)

      // Handle messages from Redis
      redis.on("message", (ch, message) => {
        if (ch === channel) {
          try {
            const { event, data } = JSON.parse(message)
            sendMessage(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          } catch (error) {
            console.error(`Error parsing Redis message for ${groupId}:`, error)
          }
        }
      })

      redis.on("error", err => {
        console.error(`Redis subscriber error for ${groupId}:`, err)
      })

      // Cleanup function
      const cleanup = () => {
        redis.unsubscribe(channel)
        redis.quit().catch(() => {
          // Ignore errors during cleanup
        })
        try {
          controller.close()
        } catch {
          // Already closed
        }
      }

      // Cleanup on request abort
      request.signal.addEventListener("abort", cleanup)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
