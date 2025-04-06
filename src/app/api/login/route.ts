import { NextResponse } from "next/server";
import { createSession } from "@/lib/session"; // adjust path as needed
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
    const body = await request.json();
    const user = body.user;
    if (!user) {
      return NextResponse.json({ message: "User details are required." }, { status: 400 });
    }
    // Create the session cookie storing the full Othent user details.
    await createSession(user);
    return NextResponse.json({ message: "Session created successfully." }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
