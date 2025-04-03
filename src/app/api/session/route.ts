import { NextResponse } from "next/server";
import { decrypt } from "@/lib/session"; // adjust path as needed
import { cookies } from "next/headers";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Create a simple in‑memory rate limiter: 10 requests per minute per IP.
const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
});

export async function GET(request: Request) {
  // Get the client IP from headers.
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  try {
    await rateLimiter.consume(ip);
  } catch (rlRejected) {
    console.error("Rate limit Error => ", rlRejected);
    return NextResponse.json(
      { message: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const payload = await decrypt(session);
    if (!payload || !payload.user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user: payload.user }, { status: 200 });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}