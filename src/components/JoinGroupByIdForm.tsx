"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { storeGroupMembership } from "@/lib/storage"

type JoinGroupByIdFormProps = {
  groupId: string
}

export function JoinGroupByIdForm({ groupId }: JoinGroupByIdFormProps) {
  const router = useRouter()
  const [memberName, setMemberName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberName: memberName.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to join group")
        setLoading(false)
        return
      }

      if (result.success && result.groupId && result.memberId) {
        storeGroupMembership(result.groupId, result.memberId)
        router.push(`/${result.groupId}`)
      }
    } catch (err) {
      console.error("Failed to join group:", err)
      setError("Failed to join group")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="member-name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
          Your Name
        </label>
        <input
          id="member-name"
          type="text"
          value={memberName}
          onChange={e => setMemberName(e.target.value)}
          required
          minLength={1}
          maxLength={100}
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg border-2 border-green-200 dark:border-cyan-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
          placeholder="Enter your name"
          autoFocus
        />
      </div>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading || !memberName.trim()}
        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
      >
        {loading ? "Joining..." : "Join Group"}
      </button>
    </form>
  )
}
