import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Check for Better Auth session cookie
  const sessionToken =
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith("/signin");
  const isProtectedPage = req.nextUrl.pathname.startsWith("/dashboard");

  // 1. Unauthenticated user trying to access protected route -> Redirect to /signin
  if (!sessionToken && isProtectedPage) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 2. Already logged in user trying to access /signin -> Redirect to /dashboard
  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};