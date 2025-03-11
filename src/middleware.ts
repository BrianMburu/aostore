import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/session"; // Ensure decrypt function handles errors appropriately

// Define protected route prefixes
const protectedRoutes = ["/dapps", "/mydapps", "/airdrops", "/messages", "/wallet"];

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Check if the request is for a protected route
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    if (!isProtected) {
      return NextResponse.next();
    }

    // Retrieve the custom "session" cookie
    const sessionCookie = req.cookies.get("session")?.value;

    if (!sessionCookie) {
      console.warn("Session cookie is missing.");
      return redirectToLogin(req);
    }

    // Decrypt and validate the session
    let payload;
    try {
      payload = await decrypt(sessionCookie);

    } catch (error) {
      console.error("Error decrypting session cookie:", error);
      return redirectToLogin(req);
    }

    if (!payload) {
      console.warn("Invalid session payload.");
      return redirectToLogin(req);
    }

    // Session is valid; proceed to the requested route
    return NextResponse.next();

  } catch (error) {
    // Handle unexpected errors and log them
    console.error("Middleware error:", error);
    // Optionally return a generic error page
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Helper function to redirect to the login page
function redirectToLogin(req: NextRequest) {
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/";
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname); // Preserve the intended route
  return NextResponse.redirect(loginUrl);
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/dapps/:path*", "/mydapps/:path*", "/airdrops/:path*", "/messages/:path*", "/wallet/:path*"],
};
