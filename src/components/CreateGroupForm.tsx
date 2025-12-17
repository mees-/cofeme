"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { storeGroupMembership } from "@/lib/storage"

export function CreateGroupForm() {
  const router = useRouter()
  const [groupName, setGroupName] = useState("")
  const [memberName, setMemberName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName.trim(),
          memberName: memberName.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to create group")
        setLoading(false)
        return
      }

      if (result.success && result.groupId && result.memberId) {
        storeGroupMembership(result.groupId, result.memberId)
        router.push(`/${result.groupId}`)
      }
    } catch (err) {
      console.error("Failed to create group:", err)
      setError("Failed to create group")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label htmlFor="group-name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
          Group Name
        </label>
        <input
          id="group-name"
          type="text"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          required
          minLength={1}
          maxLength={100}
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          placeholder="Enter group name"
        />
      </div>
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
          className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          placeholder="Enter your name"
        />
      </div>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading || !groupName.trim() || !memberName.trim()}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </form>
  )
}
