import { createGroup } from "@/app/actions/groups"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, memberName } = body

  if (!name || !memberName) {
    return NextResponse.json({ error: "name and memberName are required" }, { status: 400 })
  }

  const result = await createGroup(name, memberName)
  return NextResponse.json(result)
}
