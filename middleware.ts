// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow requests to public paths and the home page
  if (pathname === "/" || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token and trying to access a protected route, redirect to sign-in
  if (!token) {
    const signInUrl = new URL("/", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - root '/'
     * - public folder routes '/public/*'
     * - API routes '/api/*'
     * - Next.js static files (/_next/static/*)
     */
    "/((?!api|_next/static|public|privacypolicy|terms|favicon.ico).*)",
  ],
};
