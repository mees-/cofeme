import { CreateGroupForm } from "@/components/CreateGroupForm"
import Link from "next/link"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 p-4">
      <main className="max-w-sm mx-auto space-y-6 pt-8">
        <Link
          href="/"
          className="inline-block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          ← Back
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Group
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Start a new coffee coordination group</p>
        </div>

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-blue-200 dark:border-purple-800 shadow-lg p-6">
          <CreateGroupForm />
        </div>
      </main>
    </div>
  )
}
