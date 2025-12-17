import { NextRequest, NextResponse } from "next/server"
import { startRound } from "@/app/actions/rounds"

export async function POST(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params

  const result = await startRound(groupId)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}
