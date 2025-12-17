type Member = {
  id: string
  name: string
  joinedAt: Date
}

type MembersListProps = {
  members: Member[]
}

export function MembersList({ members }: MembersListProps) {
  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-orange-200 dark:border-amber-800 shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Members</h2>
      <ul className="space-y-2">
        {members.map(member => (
          <li
            key={member.id}
            className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <span className="text-gray-900 dark:text-white">{member.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(member.joinedAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
