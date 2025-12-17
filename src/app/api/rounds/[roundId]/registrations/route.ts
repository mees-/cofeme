import { NextRequest, NextResponse } from "next/server"
import { registerForCoffee, unregisterFromCoffee } from "@/app/actions/rounds"

export async function POST(request: NextRequest, { params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params
  const body = await request.json()
  const { memberId } = body

  if (!memberId) {
    return NextResponse.json({ error: "memberId is required" }, { status: 400 })
  }

  const result = await registerForCoffee(roundId, memberId)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params
  const body = await request.json()
  const { memberId } = body

  if (!memberId) {
    return NextResponse.json({ error: "memberId is required" }, { status: 400 })
  }

  const result = await unregisterFromCoffee(roundId, memberId)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}
