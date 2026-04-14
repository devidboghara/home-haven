import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory rate limit store (resets per IP every 60 seconds)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Stripe webhook bypasses all checks
  if (pathname.startsWith("/api/stripe/webhook")) {
    return NextResponse.next();
  }

  // 2. Rate limiting for /api/* paths
  if (pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry && entry.resetAt > now) {
      if (entry.count >= 100) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
      entry.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    }
  }

  // 3. Auth check for /admin/* paths
  if (pathname.startsWith("/admin/")) {
    // Check for any Supabase session cookie
    const cookies = request.cookies;
    const hasSession =
      cookies.get("sb-access-token") ||
      cookies.get("supabase-auth-token") ||
      [...cookies.getAll()].some(
        (c) => c.name.startsWith("sb-") && c.value.length > 0
      );

    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 4. Role-based access restriction for read_only users
    const role = cookies.get("user-role")?.value;
    if (
      role === "read_only" &&
      (pathname === "/admin/settings" || pathname.startsWith("/admin/settings/") ||
       pathname === "/admin/team" || pathname.startsWith("/admin/team/"))
    ) {
      return NextResponse.redirect(new URL("/admin?error=forbidden", request.url));
    }
  }

  return NextResponse.next();
}
