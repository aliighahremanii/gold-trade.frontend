import type { NextResponse } from "next/server";

import type { CookieStoreLike } from "@/shared/auth/session-guard";

export type StoredSessionTokens = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

export type StoredDeviceContext = {
  deviceId: string;
  deviceName: string;
};

export type SessionCookieConfig = {
  sessionCookieName: string;
  refreshCookieName: string;
  deviceIdCookieName: string;
  deviceNameCookieName: string;
};

export function getSessionCookieConfig(): SessionCookieConfig {
  return {
    sessionCookieName: process.env.FRONTEND_SESSION_COOKIE_NAME ?? "gt_session",
    refreshCookieName: process.env.FRONTEND_REFRESH_COOKIE_NAME ?? "gt_refresh",
    deviceIdCookieName: process.env.FRONTEND_DEVICE_ID_COOKIE_NAME ?? "gt_device_id",
    deviceNameCookieName: process.env.FRONTEND_DEVICE_NAME_COOKIE_NAME ?? "gt_device_name",
  };
}

export function getSessionToken(
  cookieStore: CookieStoreLike,
  config: SessionCookieConfig = getSessionCookieConfig(),
) {
  return cookieStore.get(config.sessionCookieName)?.value;
}

export function getRefreshToken(
  cookieStore: CookieStoreLike,
  config: SessionCookieConfig = getSessionCookieConfig(),
) {
  return cookieStore.get(config.refreshCookieName)?.value;
}

export function getStoredDeviceContext(
  cookieStore: CookieStoreLike,
  config: SessionCookieConfig = getSessionCookieConfig(),
): StoredDeviceContext | null {
  const deviceId = cookieStore.get(config.deviceIdCookieName)?.value;
  const deviceName = cookieStore.get(config.deviceNameCookieName)?.value;

  if (!deviceId || !deviceName) {
    return null;
  }

  return { deviceId, deviceName };
}

function serializeCookies(cookieStore: CookieStoreLike) {
  return cookieStore
    .getAll()
    .map(({ name, value }) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
    .join("; ");
}

export function buildSessionAuthHeaders(
  cookieStore: CookieStoreLike,
  config: SessionCookieConfig = getSessionCookieConfig(),
) {
  const headers: Record<string, string> = {};
  const cookieHeader = serializeCookies(cookieStore);

  if (cookieHeader) {
    headers.cookie = cookieHeader;
  }

  const sessionToken = getSessionToken(cookieStore, config);

  if (sessionToken) {
    headers.authorization = `Bearer ${sessionToken}`;
  }

  return headers;
}

export function setSessionCookies(
  response: NextResponse,
  tokens: StoredSessionTokens,
  deviceContext: StoredDeviceContext,
  config: SessionCookieConfig = getSessionCookieConfig(),
) {
  response.cookies.set(config.sessionCookieName, tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(tokens.accessTokenExpiresAt),
  });

  response.cookies.set(config.refreshCookieName, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(tokens.refreshTokenExpiresAt),
  });

  response.cookies.set(config.deviceIdCookieName, deviceContext.deviceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(tokens.refreshTokenExpiresAt),
  });

  response.cookies.set(config.deviceNameCookieName, deviceContext.deviceName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(tokens.refreshTokenExpiresAt),
  });
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date,
  config: SessionCookieConfig = getSessionCookieConfig(),
) {
  response.cookies.set(config.sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(
  response: NextResponse,
  config: SessionCookieConfig = getSessionCookieConfig(),
) {
  response.cookies.set(config.sessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function clearSessionCookies(
  response: NextResponse,
  config: SessionCookieConfig = getSessionCookieConfig(),
) {
  clearSessionCookie(response, config);

  response.cookies.set(config.refreshCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(config.deviceIdCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(config.deviceNameCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function forwardSetCookieHeaders(source: Response, target: NextResponse) {
  for (const cookie of source.headers.getSetCookie()) {
    target.headers.append("Set-Cookie", cookie);
  }
}
