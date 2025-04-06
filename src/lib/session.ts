import "server-only";

import { cookies } from "next/headers";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { TokenExpiry } from "@/config/auth";
import { User } from "@/types/user";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined");
}
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Encrypts a given payload into a JWT.
 */
export async function encrypt(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Decrypts and verifies a JWT session string.
 */
export async function decrypt(session: string | undefined = ""): Promise<JWTPayload | undefined> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session:", error);
  }
}

/**
 * Creates a session cookie storing the full Othent user details.
 * @param user - The user details from Othent.
 */
export async function createSession(user: User): Promise<void> {
  const expiresAt = new Date(Date.now() + TokenExpiry);
  // Prepare payload with user details.
  const payload: JWTPayload = {
    user, // store the user details in the payload
    expiresAt: expiresAt.toISOString(),
  };
  const session = await encrypt(payload);
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Updates the session cookie by renewing its expiration time.
 * It reuses the stored payload (which includes user details).
 */
export async function updateSession(): Promise<void | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const payload = await decrypt(sessionCookie);

  if (!sessionCookie || !payload) {
    return null;
  }

  const newExpires = new Date(Date.now() + TokenExpiry);
  // Re-sign the same payload to renew the session expiration.
  const updatedSession = await encrypt(payload);
  cookieStore.set("session", updatedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: newExpires,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Deletes the session cookie.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}