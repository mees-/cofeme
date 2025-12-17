import Link from "next/link"

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-cyan-950 dark:to-green-950 p-4">
      <main className="max-w-sm mx-auto space-y-6 pt-8">
        <Link
          href="/"
          className="inline-block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          ← Back
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
            Join Group
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Enter a group ID to join</p>
        </div>

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-green-200 dark:border-cyan-800 shadow-lg p-6">
          <p> You can join a group by either scanning the QR code or entering the group ID.</p>
          <p> If you don't have the group ID, ask someone in the group to share the QR code with you.</p>
          <p> If you don't have the QR code, ask someone in the group to send you the join link.</p>
          <p> If you don't have the join link, ask someone in the group to share the QR code with you.</p>
          <p> If you don't have the QR code, ask someone in the group to send you the join link.</p>
        </div>
      </main>
    </div>
  )
}
