import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { coffeeRounds, coffeeRegistrations } from "@/lib/db/schema"
import { eq, and, lt } from "drizzle-orm"
import { DateTime } from "luxon"
import { selectMemberByProbability } from "@/lib/probability"
import { broadcast } from "@/lib/sse"

export async function GET() {
  const now = DateTime.now().toJSDate()

  // Find all active rounds that have expired
  const expiredRounds = await db.query.coffeeRounds.findMany({
    where: {
      status: "active",
      expiresAt: { lt: now },
    },
    with: {
      registrations: {
        with: {
          member: true,
        },
        orderBy: { registeredAt: "asc" },
      },
      group: true,
    },
  })

  const results = []

  for (const round of expiredRounds) {
    if (round.registrations.length === 0) {
      // No registrations, just mark as completed
      await db
        .update(coffeeRounds)
        .set({
          status: "completed",
        })
        .where(eq(coffeeRounds.id, round.id))

      broadcast(round.groupId)

      results.push({
        roundId: round.id,
        groupId: round.groupId,
        action: "completed_no_registrations",
      })
      continue
    }

    // Select member using probability
    const selectedIndex = selectMemberByProbability(round.registrations.length)
    const selectedRegistration = round.registrations[selectedIndex]

    if (!selectedRegistration || !selectedRegistration.member) {
      // Skip this round if invalid registration
      continue
    }

    const selectedMember = selectedRegistration.member

    // Mark round as completed with assignment
    await db
      .update(coffeeRounds)
      .set({
        assignedTo: selectedMember.id,
        status: "completed",
        isVolunteer: false,
      })
      .where(eq(coffeeRounds.id, round.id))

    // Delete all registrations
    await db.delete(coffeeRegistrations).where(eq(coffeeRegistrations.roundId, round.id))

    broadcast(round.groupId)

    results.push({
      roundId: round.id,
      groupId: round.groupId,
      action: "assigned",
      assignedTo: selectedMember.id,
    })
  }

  return NextResponse.json({
    processed: expiredRounds.length,
    results,
  })
}
