"use server"

import { nanoid } from "nanoid"
import { db } from "@/lib/db"
import { coffeeRounds, coffeeRegistrations } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { DateTime } from "luxon"
import { revalidatePath } from "next/cache"
import { broadcast } from "@/lib/sse"

const COFFEE_ROUND_DURATION_MS = parseInt(process.env.COFFEE_ROUND_DURATION_MS || "300000", 10)

export async function startRound(groupId: string) {
  // Check if there's an active round
  const activeRound = await db.query.coffeeRounds.findFirst({
    where: {
      groupId,
      status: "active",
    },
  })

  if (activeRound) {
    return { success: false, error: "An active round already exists" }
  }

  const roundId = nanoid()
  const now = DateTime.now()
  const expiresAt = now.plus({ milliseconds: COFFEE_ROUND_DURATION_MS })

  await db.insert(coffeeRounds).values({
    id: roundId,
    groupId,
    startedAt: now.toJSDate(),
    expiresAt: expiresAt.toJSDate(),
    status: "active",
    isVolunteer: false,
  })

  broadcast(groupId)
  revalidatePath(`/${groupId}`)
  return { success: true, roundId }
}

export async function registerForCoffee(roundId: string, memberId: string) {
  // Check if round exists and is active
  const round = await db.query.coffeeRounds.findFirst({
    where: { id: roundId },
  })

  if (!round) {
    return { success: false, error: "Round not found" }
  }

  if (round.status !== "active") {
    return { success: false, error: "Round is not active" }
  }

  // Check if already registered
  const existing = await db.query.coffeeRegistrations.findFirst({
    where: {
      roundId,
      memberId,
    },
  })

  if (existing) {
    return { success: false, error: "Already registered" }
  }

  const registrationId = nanoid()

  await db.insert(coffeeRegistrations).values({
    id: registrationId,
    roundId,
    memberId,
  })

  // Get member info for broadcast
  const member = await db.query.members.findFirst({
    where: { id: memberId },
  })

  broadcast(round.groupId)
  revalidatePath(`/${round.groupId}`)
  return { success: true, registrationId }
}

export async function unregisterFromCoffee(roundId: string, memberId: string) {
  const round = await db.query.coffeeRounds.findFirst({
    where: { id: roundId },
  })

  if (!round) {
    return { success: false, error: "Round not found" }
  }

  await db
    .delete(coffeeRegistrations)
    .where(and(eq(coffeeRegistrations.roundId, roundId), eq(coffeeRegistrations.memberId, memberId)))

  broadcast(round.groupId)
  revalidatePath(`/${round.groupId}`)
  return { success: true }
}

export async function volunteerForCoffee(roundId: string, memberId: string) {
  const round = await db.query.coffeeRounds.findFirst({
    where: { id: roundId },
  })

  if (!round) {
    return { success: false, error: "Round not found" }
  }

  if (round.status !== "active") {
    return { success: false, error: "Round is not active" }
  }

  // Mark round as completed with volunteer
  await db
    .update(coffeeRounds)
    .set({
      assignedTo: memberId,
      status: "completed",
      isVolunteer: true,
    })
    .where(eq(coffeeRounds.id, roundId))

  // Delete all registrations
  await db.delete(coffeeRegistrations).where(eq(coffeeRegistrations.roundId, roundId))

  broadcast(round.groupId)
  revalidatePath(`/${round.groupId}`)
  return { success: true }
}

export async function assignCoffee(roundId: string) {
  const round = await db.query.coffeeRounds.findFirst({
    where: { id: roundId },
    with: {
      registrations: {
        with: {
          member: true,
        },
        orderBy: { registeredAt: "asc" },
      },
    },
  })

  if (!round) {
    return { success: false, error: "Round not found" }
  }

  if (round.status !== "active") {
    return { success: false, error: "Round is not active" }
  }

  if (round.registrations.length === 0) {
    return { success: false, error: "No registrations to assign" }
  }

  // Use probability to select member
  const { selectMemberByProbability } = await import("@/lib/probability")
  const selectedIndex = selectMemberByProbability(round.registrations.length)
  const selectedRegistration = round.registrations[selectedIndex]

  if (!selectedRegistration || !selectedRegistration.member) {
    return { success: false, error: "Invalid registration selected" }
  }

  const selectedMember = selectedRegistration.member

  // Mark round as completed
  await db
    .update(coffeeRounds)
    .set({
      assignedTo: selectedMember.id,
      status: "completed",
      isVolunteer: false,
    })
    .where(eq(coffeeRounds.id, roundId))

  // Delete all registrations
  await db.delete(coffeeRegistrations).where(eq(coffeeRegistrations.roundId, roundId))

  broadcast(round.groupId)
  revalidatePath(`/${round.groupId}`)
  return { success: true, assignedTo: selectedMember.id }
}
