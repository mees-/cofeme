"use client"

type Registration = {
  id: string
  member: {
    id: string
    name: string
  }
  registeredAt: Date
}

type RegistrationsListProps = {
  groupId: string
  roundId: string
  initialRegistrations: Registration[]
  currentMemberId: string | null
}

export function RegistrationsList({ initialRegistrations, currentMemberId }: RegistrationsListProps) {
  const registrations = initialRegistrations

  if (registrations.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-blue-200 dark:border-cyan-800 shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Registrations</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center py-4">No one has registered yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-blue-200 dark:border-cyan-800 shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Registrations ({registrations.length})
      </h2>
      <ol className="space-y-2">
        {registrations.map((reg, index) => (
          <li
            key={reg.id}
            className={`flex items-center gap-3 py-3 px-4 rounded-lg ${
              reg.member.id === currentMemberId
                ? "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-300 dark:border-cyan-700"
                : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm">
              {index + 1}
            </span>
            <span className="text-gray-900 dark:text-white font-medium flex-1">
              {reg.member.name}
              {reg.member.id === currentMemberId && (
                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">You</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
