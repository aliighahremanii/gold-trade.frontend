import { describe, expect, it } from "vitest";

import { CustomerDashboardShellFlow } from "@/modules/wallet/flows/customer-dashboard-shell-flow";
import { CustomerQuickLinks } from "@/shared/layout/customer-quick-links";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";
import { customerNav } from "@/shared/layout/customer-nav";

describe("CustomerDashboardShellFlow", () => {
  it("composes the dashboard shell with workflow shortcuts", () => {
    const element = CustomerDashboardShellFlow();

    expect(element.type).toBe(CustomerWorkflowShell);
    expect(element.props).toMatchObject({
      title: "Dashboard",
      module: "wallet",
    });
    expect(element.props.children?.type).toBe(CustomerQuickLinks);
  });
});

describe("CustomerQuickLinks", () => {
  it("exposes every customer navigation destination", () => {
    expect(customerNav.map((item) => item.label)).toEqual([
      "Dashboard",
      "Wallet",
      "Buy",
      "Sell",
      "Deposit",
      "Withdraw",
      "Delivery",
      "Orders",
    ]);
  });
});
