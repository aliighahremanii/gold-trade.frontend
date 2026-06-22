import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleAuthRoute } from "@/shared/auth/auth-route-handler";

type CookieStoreValue = {
  name: string;
  value: string;
};

const { mockCookies } = vi.hoisted(() => ({
  mockCookies: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: mockCookies,
}));

function createCookieStore(values: Record<string, string>) {
  const entries = Object.entries(values);

  return {
    get(name: string) {
      const value = values[name];

      return value ? { value } : undefined;
    },
    getAll(): CookieStoreValue[] {
      return entries.map(([name, value]) => ({ name, value }));
    },
  };
}

function getSetCookies(response: Response) {
  return response.headers.getSetCookie?.() ?? [response.headers.get("set-cookie") ?? ""];
}

describe("handleAuthRoute", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCookies.mockResolvedValue(
      createCookieStore({
        gt_session: "access-token",
        gt_refresh: "refresh-token",
        gt_device_id: "device-1",
        gt_device_name: "Browser 1",
      }),
    );
  });

  it("clears browser session cookies even when backend sign-out fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ code: "unexpected", message: "server error" }), {
          status: 500,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    const response = await handleAuthRoute(
      new Request("http://localhost/api/auth/sign-out"),
      "/auth/sign-out",
    );

    expect(response.status).toBe(500);

    const setCookies = getSetCookies(response).join("\n");

    expect(setCookies).toContain("gt_session=");
    expect(setCookies).toContain("gt_refresh=");
    expect(setCookies).toContain("gt_device_id=");
    expect(setCookies).toContain("gt_device_name=");
  });

  it("stores access, refresh, and device cookies after sign-in", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            accessToken: "access-2",
            accessTokenExpiresAt: "2026-06-22T12:00:00.000Z",
            refreshToken: "refresh-2",
            refreshTokenExpiresAt: "2026-07-22T12:00:00.000Z",
            requiresTotp: false,
            isEmailVerified: true,
            isMobileVerified: true,
            sessionId: "session-1",
            userId: "user-1",
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        ),
      ),
    );

    const response = await handleAuthRoute(
      new Request("http://localhost/api/auth/sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "user@example.com",
          password: "password",
          deviceId: "device-2",
          deviceName: "Browser 2",
        }),
      }),
      "/auth/sign-in",
    );

    expect(response.status).toBe(200);

    const setCookies = getSetCookies(response).join("\n");

    expect(setCookies).toContain("gt_session=access-2");
    expect(setCookies).toContain("gt_refresh=refresh-2");
    expect(setCookies).toContain("gt_device_id=device-2");
    expect(setCookies).toContain("gt_device_name=Browser%202");
  });
});