import { NextRequest, NextResponse } from "next/server";
import { assignCoffee } from "@/app/actions/rounds";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roundId: string }> }
) {
  const { roundId } = await params;

  const result = await assignCoffee(roundId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}

