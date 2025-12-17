type RoundStatusProps = {
  round: {
    id: string
    status: "active" | "completed"
    assignedTo: string | null
    isVolunteer: boolean
    expiresAt: Date
  } | null
  assignedMemberName: string | null
}

export function RoundStatus({ round, assignedMemberName }: RoundStatusProps) {
  if (!round) {
    return null
  }

  if (round.status === "completed") {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Round Completed</h2>
        {assignedMemberName && (
          <p className="text-purple-50">
            {round.isVolunteer ? (
              <>
                <span className="font-bold">{assignedMemberName}</span> volunteered to get coffee!
              </>
            ) : (
              <>
                <span className="font-bold">{assignedMemberName}</span> was assigned to get coffee.
              </>
            )}
          </p>
        )}
      </div>
    )
  }

  return null
}
