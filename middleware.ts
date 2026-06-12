import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-url", request.url);
  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:txt|xml|html|png|jpg|svg|ico|json|webmanifest)).*)"],
};
