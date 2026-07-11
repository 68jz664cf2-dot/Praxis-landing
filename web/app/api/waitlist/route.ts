import { NextResponse } from "next/server";
import { joinWaitlist } from "@/lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const result = await joinWaitlist({
    fullName: b.fullName,
    email: b.email,
    country: b.country,
    age: b.age,
    source: b.source === "hero" || b.source === "cta" ? b.source : "unknown",
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
