import { describe, expect, it } from "vitest";

import SignInPage from "@/app/(auth)/sign-in/page";
import DashboardPage from "@/app/(customer)/dashboard/page";
import BuyGoldPage from "@/app/(customer)/trade/buy/page";
import { SignInFlow } from "@/modules/identity/flows/sign-in-flow";
import { BuyGoldShellFlow } from "@/modules/trading/flows/buy-gold-shell-flow";
import { CustomerDashboardShellFlow } from "@/modules/wallet/flows/customer-dashboard-shell-flow";
import { siteConfig } from "@/shared/config/site";

describe("scaffold", () => {
  it("exposes site configuration", () => {
    expect(siteConfig.name).toBe("Gold Trade");
  });

  it("keeps route pages as thin module flow composition", async () => {
    const signInElement = await SignInPage({
      searchParams: Promise.resolve({ next: "/dashboard", reason: "auth_required" }),
    });
    const dashboardElement = DashboardPage();
    const buyGoldElement = BuyGoldPage();

    expect(signInElement.type).toBe(SignInFlow);
    expect(signInElement.props).toMatchObject({
      nextPath: "/dashboard",
      reason: "auth_required",
    });

    expect(dashboardElement.type).toBe(CustomerDashboardShellFlow);
    expect(buyGoldElement.type).toBe(BuyGoldShellFlow);
  });
});
