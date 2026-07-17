import { NextResponse } from "next/server";
import { all } from "@/lib/hermes-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(all());
}
