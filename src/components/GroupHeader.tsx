type GroupHeaderProps = {
  name: string
  memberCount: number
}

export function GroupHeader({ name, memberCount }: GroupHeaderProps) {
  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border-2 border-orange-200 dark:border-amber-800 shadow-lg p-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">
        {name}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {memberCount} {memberCount === 1 ? "member" : "members"}
      </p>
    </div>
  )
}
