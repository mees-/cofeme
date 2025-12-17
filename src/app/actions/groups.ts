"use server"

import { nanoid } from "nanoid"
import { db } from "@/lib/db"
import { groups, members } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { broadcast } from "@/lib/sse"

export async function createGroup(groupName: string, memberName: string) {
  const groupId = nanoid()
  const memberId = nanoid()
  const now = new Date()

  // Create group and member in a transaction
  await db.insert(groups).values({
    id: groupId,
    name: groupName,
    createdAt: now,
    updatedAt: now,
  })

  await db.insert(members).values({
    id: memberId,
    groupId,
    name: memberName,
  })

  broadcast(groupId)

  revalidatePath(`/${groupId}`)
  return { success: true, groupId, memberId }
}

export async function joinGroup(groupId: string, memberName: string) {
  // Check if group exists
  const group = await db.query.groups.findFirst({
    where: { id: groupId },
  })

  if (!group) {
    return { success: false, error: "Group not found" }
  }

  const memberId = nanoid()

  await db.insert(members).values({
    id: memberId,
    groupId,
    name: memberName,
  })

  broadcast(groupId)
  revalidatePath(`/${groupId}`)
  return { success: true, memberId, groupId }
}
