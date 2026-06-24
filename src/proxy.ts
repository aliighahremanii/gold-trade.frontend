import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSecurityResponseHeaders } from "@/shared/config/security-headers";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-request-path", request.nextUrl.pathname);
  requestHeaders.set("x-request-search", request.nextUrl.search);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  for (const header of getSecurityResponseHeaders()) {
    response.headers.set(header.key, header.value);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};