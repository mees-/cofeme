import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 flex items-center justify-center p-4">
      <main className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            CoffeeMe
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Coordinate coffee runs with your team</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/create"
            className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl text-center transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Create Group
          </Link>

          <Link
            href="/join"
            className="block w-full py-4 px-6 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-medium rounded-xl text-center transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Join Group
          </Link>
        </div>
      </main>
    </div>
  )
}
