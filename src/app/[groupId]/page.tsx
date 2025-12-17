import { redirect } from "next/navigation"
import { GroupHeader } from "@/components/GroupHeader"
import { MembersList } from "@/components/MembersList"
import { RoundStatus } from "@/components/RoundStatus"
import { Timer } from "@/components/Timer"
import { ShareButton } from "@/components/ShareButton"
import { StartRoundButton } from "@/components/StartRoundButton"
import { ClientGroupPage } from "@/components/ClientGroupPage"
import { GroupPageSSE } from "@/components/GroupPageSSE"
import { db } from "@/lib/db"

type PageProps = {
  params: Promise<{ groupId: string }>
}

export default async function GroupPage({ params }: PageProps) {
  const { groupId } = await params

  const group = await db.query.groups.findFirst({
    where: { id: groupId },
    with: {
      members: true,
    },
  })

  if (!group) {
    redirect("/")
  }

  // Find active round if it exists
  const activeRound = await db.query.coffeeRounds.findFirst({
    where: {
      groupId,
      status: "active",
    },
    with: {
      assignedMember: true,
      registrations: {
        with: {
          member: true,
        },
      },
    },
  })

  // Sort registrations by registeredAt
  if (activeRound && activeRound.registrations) {
    activeRound.registrations.sort((a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime())
  }

  const assignedMemberName = activeRound?.assignedMember?.name || null

  return (
    <GroupPageSSE groupId={groupId}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-950 dark:to-amber-950 p-4">
        <div className="max-w-sm mx-auto space-y-4">
          <GroupHeader name={group.name} memberCount={group.members.length} />

          <ShareButton groupId={groupId} groupName={group.name} />

          {activeRound ? (
            <>
              <Timer expiresAt={new Date(activeRound.expiresAt)} />

              <RoundStatus round={activeRound} assignedMemberName={assignedMemberName} />

              {activeRound.status === "active" && <ClientGroupPage groupId={groupId} activeRound={activeRound} />}
            </>
          ) : (
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-orange-200 dark:border-amber-800 shadow-lg p-6">
              <StartRoundButton groupId={groupId} />
            </div>
          )}

          <MembersList members={group.members} />
        </div>
      </div>
    </GroupPageSSE>
  )
}
