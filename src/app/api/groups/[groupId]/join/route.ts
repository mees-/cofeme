import { NextRequest, NextResponse } from "next/server"
import { joinGroup } from "@/app/actions/groups"

export async function POST(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const body = await request.json()
  const { memberName } = body

  if (!memberName) {
    return NextResponse.json({ error: "memberName is required" }, { status: 400 })
  }

  const result = await joinGroup(groupId, memberName)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}
