"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type VolunteerButtonProps = {
  roundId: string
  memberId: string
  groupId: string
}

export function VolunteerButton({ roundId, memberId, groupId }: VolunteerButtonProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleVolunteer() {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`/api/rounds/${roundId}/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to volunteer")
        setLoading(false)
        return
      }

      if (result.success) {
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Failed to volunteer")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleVolunteer}
        disabled={loading || !!error}
        className="w-full py-4 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
      >
        {loading ? "Volunteering..." : "I'll Get Coffee!"}
      </button>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>
      )}
    </div>
  )
}
