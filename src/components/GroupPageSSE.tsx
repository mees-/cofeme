"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

type GroupPageSSEProps = {
  groupId: string
  children: React.ReactNode
}

export function GroupPageSSE({ groupId, children }: GroupPageSSEProps) {
  const router = useRouter()

  useEffect(() => {
    let eventSource: EventSource | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5

    const connect = () => {
      if (eventSource) {
        eventSource.close()
      }

      eventSource = new EventSource(`/api/sse/${groupId}`)

      eventSource.addEventListener("connected", () => {
        reconnectAttempts = 0
      })

      eventSource.addEventListener("update", () => {
        router.refresh()
      })

      eventSource.onerror = () => {
        eventSource?.close()

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++
            connect()
          }, delay)
        }
      }
    }

    connect()

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [groupId, router])

  return <>{children}</>
}
