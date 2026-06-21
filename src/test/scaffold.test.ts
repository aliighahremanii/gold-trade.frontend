import { describe, expect, it } from "vitest";

import SignInPage from "@/app/(auth)/sign-in/page";
import DashboardPage from "@/app/(customer)/dashboard/page";
import BuyGoldPage from "@/app/(customer)/trade/buy/page";
import { SignInScaffoldFlow } from "@/modules/identity/flows/sign-in-scaffold-flow";
import { ScaffoldPage } from "@/shared/layout/scaffold-page";
import { siteConfig } from "@/shared/config/site";

describe("scaffold", () => {
  it("exposes site configuration", () => {
    expect(siteConfig.name).toBe("Gold Trade");
  });

  it("keeps route pages as thin scaffold composition", async () => {
    const signInElement = await SignInPage({
      searchParams: Promise.resolve({ next: "/dashboard", reason: "auth_required" }),
    });
    const dashboardElement = DashboardPage();
    const buyGoldElement = BuyGoldPage();

    expect(signInElement.type).toBe(SignInScaffoldFlow);
    expect(signInElement.props).toMatchObject({
      nextPath: "/dashboard",
      reason: "auth_required",
    });

    expect(dashboardElement.type).toBe(ScaffoldPage);
    expect(dashboardElement.props).toMatchObject({ title: "Dashboard", module: "wallet" });

    expect(buyGoldElement.type).toBe(ScaffoldPage);
    expect(buyGoldElement.props).toMatchObject({ title: "Buy gold", module: "trading" });
  });
});
