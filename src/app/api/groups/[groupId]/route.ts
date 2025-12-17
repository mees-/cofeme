import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params

  const group = await db.query.groups.findFirst({
    where: { id: groupId },
    with: {
      members: true,
    },
  })

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
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
    activeRound.registrations.sort(
      (a: any, b: any) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime(),
    )
  }

  return NextResponse.json({
    ...group,
    activeRound,
  })
}
