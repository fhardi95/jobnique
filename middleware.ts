import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ads.txt") {
    return NextResponse.rewrite(new URL("/api/ads-txt", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-url", request.url);
  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:xml|html|png|jpg|svg|ico|json|webmanifest)).*)"],
};
