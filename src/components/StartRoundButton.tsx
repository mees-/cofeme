"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type StartRoundButtonProps = {
  groupId: string
}

export function StartRoundButton({ groupId }: StartRoundButtonProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleStart() {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`/api/groups/${groupId}/rounds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to start round")
        setLoading(false)
        return
      }

      if (result.success) {
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Failed to start round")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleStart}
        disabled={loading || !!error}
        className="w-full py-4 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
      >
        {loading ? "Starting..." : "Start Coffee Round"}
      </button>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>
      )}
    </div>
  )
}
