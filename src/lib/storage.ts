"use client"

const GROUP_ID_KEY = "cofeme_group_id"
const MEMBER_ID_KEY = "cofeme_member_id"

export function getStoredGroupId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(GROUP_ID_KEY)
}

export function getStoredMemberId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(MEMBER_ID_KEY)
}

export function storeGroupMembership(groupId: string, memberId: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(GROUP_ID_KEY, groupId)
  localStorage.setItem(MEMBER_ID_KEY, memberId)
}

export function clearGroupMembership(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(GROUP_ID_KEY)
  localStorage.removeItem(MEMBER_ID_KEY)
}
