import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { coffeeRounds } from "@/lib/db/schema"

export async function GET(request: NextRequest, { params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params

  const round = await db.query.coffeeRounds.findFirst({
    where: { id: roundId },
    with: {
      group: true,
      assignedMember: true,
      registrations: {
        with: {
          member: true,
        },
      },
    },
  })

  if (!round) {
    return NextResponse.json({ error: "Round not found" }, { status: 404 })
  }

  return NextResponse.json(round)
}
