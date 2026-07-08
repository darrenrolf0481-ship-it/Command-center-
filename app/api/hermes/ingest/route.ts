import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // This endpoint acts as a webhook for Lab Brain to push escalations
    console.log("Received escalation from Lab Brain/ARGUS:", payload);
    
    // In a real application, we would store this escalation in a database
    // or push it to the frontend via Server-Sent Events or WebSockets.
    
    return NextResponse.json({ success: true, message: "Escalation ingested successfully" });
  } catch (error: any) {
    console.error("Hermes Ingest Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to ingest escalation" },
      { status: 500 }
    );
  }
}
