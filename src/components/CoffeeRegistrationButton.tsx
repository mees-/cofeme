"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type CoffeeRegistrationButtonProps = {
  roundId: string
  memberId: string
  isRegistered: boolean
  groupId: string
}

export function CoffeeRegistrationButton({ roundId, memberId, isRegistered, groupId }: CoffeeRegistrationButtonProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setError(null)
    setLoading(true)
    try {
      if (isRegistered) {
        const response = await fetch(`/api/rounds/${roundId}/registrations`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId }),
        })

        const result = await response.json()

        if (!response.ok) {
          setError(result.error || "Failed to unregister")
          setLoading(false)
          return
        }

        if (result.success) {
          router.refresh()
        }
      } else {
        const response = await fetch(`/api/rounds/${roundId}/registrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId }),
        })

        const result = await response.json()

        if (!response.ok) {
          setError(result.error || "Failed to register")
          setLoading(false)
          return
        }

        if (result.success) {
          router.refresh()
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to update registration")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleToggle}
        disabled={loading || !!error}
        className={`w-full py-4 px-4 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 ${
          isRegistered
            ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        }`}
      >
        {loading ? "Updating..." : isRegistered ? "Unregister" : "Register for Coffee"}
      </button>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>
      )}
    </div>
  )
}
