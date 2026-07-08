import { NextRequest, NextResponse } from "next/server";
import { append } from "@/lib/hermes-store";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    append({
      source: payload.source || "unknown",
      type: payload.type || "event",
      content: typeof payload.content === "string"
        ? payload.content
        : JSON.stringify(payload),
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
