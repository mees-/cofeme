"use client"

import { useEffect, useState } from "react"
import { getStoredMemberId } from "@/lib/storage"
import { CoffeeRegistrationButton } from "./CoffeeRegistrationButton"
import { AssignButton } from "./AssignButton"
import { VolunteerButton } from "./VolunteerButton"
import { RegistrationsList } from "./RegistrationsList"

type ClientGroupPageProps = {
  groupId: string
  activeRound: {
    id: string
    status: "active" | "completed"
    registrations: Array<{
      id: string
      member: {
        id: string
        name: string
      } | null
    }>
  } | null
}

export function ClientGroupPage({ groupId, activeRound }: ClientGroupPageProps) {
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null)

  useEffect(() => {
    setCurrentMemberId(getStoredMemberId())
  }, [])

  if (!activeRound || activeRound.status !== "active") {
    return null
  }

  const isRegistered = activeRound.registrations.some(r => r.member && r.member.id === currentMemberId) || false

  return (
    <>
      {currentMemberId && (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-blue-200 dark:border-cyan-800 shadow-lg p-6">
          <CoffeeRegistrationButton
            roundId={activeRound.id}
            memberId={currentMemberId}
            isRegistered={isRegistered}
            groupId={groupId}
          />
        </div>
      )}

      <RegistrationsList
        groupId={groupId}
        roundId={activeRound.id}
        initialRegistrations={activeRound.registrations
          .filter(r => r.member !== null)
          .map(r => ({
            id: r.id,
            member: r.member!,
            registeredAt: new Date(),
          }))}
        currentMemberId={currentMemberId}
      />

      {currentMemberId && (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-green-200 dark:border-emerald-800 shadow-lg p-6 space-y-3">
          <VolunteerButton roundId={activeRound.id} memberId={currentMemberId} groupId={groupId} />
          <AssignButton roundId={activeRound.id} groupId={groupId} />
        </div>
      )}
    </>
  )
}
