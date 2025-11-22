import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const config = {
  matcher: ["/api/:path*"],
};

export default async function proxy(req: NextRequest) {
  try {
    // Skip auth check for selected PUBLIC endpoints
    if (
      req.nextUrl.pathname.includes("/api/og") ||
      req.nextUrl.pathname.includes("/api/webhook/farcaster") ||
      req.nextUrl.pathname.includes("/api/notify") ||
      req.nextUrl.pathname.includes("/api/auth/")
    ) {
      return NextResponse.next();
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      console.log("No session, redirecting to sign-in", req.nextUrl.pathname);
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error(error);

    const requestHeaders = new Headers(req.headers);
    requestHeaders.delete("x-user-fid");
    requestHeaders.delete("x-user-wallet-address");

    return NextResponse.json(
      { error: "Invalid token" },
      {
        status: 401,
        headers: requestHeaders,
      }
    );
  }
}
