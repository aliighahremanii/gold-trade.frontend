import { describe, expect, it } from "vitest";

import { isNavItemActive } from "@/shared/layout/app-shell-nav";

describe("isNavItemActive", () => {
  it("marks exact route matches as active", () => {
    expect(isNavItemActive("/wallet", "/wallet")).toBe(true);
  });

  it("marks nested delivery routes as active for delivery navigation", () => {
    expect(isNavItemActive("/delivery/request", "/delivery/request")).toBe(true);
    expect(isNavItemActive("/delivery/abc-123", "/delivery/request")).toBe(true);
  });

  it("does not mark dashboard as active for unrelated nested routes", () => {
    expect(isNavItemActive("/trade/buy", "/dashboard")).toBe(false);
  });
});
