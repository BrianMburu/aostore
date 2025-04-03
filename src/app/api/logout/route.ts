import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session"; // adjust path as needed
import { RateLimiterMemory } from "rate-limiter-flexible";

// In‑memory rate limiter: 5 requests per minute per IP.
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

export async function POST(request: Request) {
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
    await deleteSession();
    return NextResponse.json({ message: "Session deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
