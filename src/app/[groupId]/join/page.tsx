import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import { JoinGroupByIdForm } from "@/components/JoinGroupByIdForm"

type PageProps = {
  params: Promise<{ groupId: string }>
}

export default async function JoinPage({ params }: PageProps) {
  const { groupId } = await params

  const group = await db.query.groups.findFirst({
    where: { id: groupId },
  })

  if (!group) {
    redirect("/")
  }

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
            Join {group.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">How to join this group</p>
        </div>

        <JoinGroupByIdForm groupId={groupId} />
      </main>
    </div>
  )
}
