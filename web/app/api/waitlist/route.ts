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

  const { email, source } =
    (body as { email?: unknown; source?: "hero" | "cta" }) ?? {};

  const result = await joinWaitlist(
    email,
    source === "hero" || source === "cta" ? source : "unknown",
  );

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result, { status: 200 });
}
