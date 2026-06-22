import type { NextResponse } from "next/server";

import type { CookieStoreLike } from "@/shared/auth/session-guard";

export const MOBILE_VERIFICATION_ACK_COOKIE = "gt_mobile_verified_ack";
const MOBILE_VERIFICATION_ACK_MAX_AGE_SECONDS = 10 * 60;

export function hasMobileVerificationAck(cookieStore: CookieStoreLike, userId: string) {
  return cookieStore.get(MOBILE_VERIFICATION_ACK_COOKIE)?.value === userId;
}

export function setMobileVerificationAck(response: NextResponse, userId: string) {
  response.cookies.set(MOBILE_VERIFICATION_ACK_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MOBILE_VERIFICATION_ACK_MAX_AGE_SECONDS,
  });
}

export function clearMobileVerificationAck(response: NextResponse) {
  response.cookies.set(MOBILE_VERIFICATION_ACK_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
