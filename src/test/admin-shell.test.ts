import { describe, expect, it } from "vitest";

import { AdminDashboardCards } from "@/modules/admin/components/admin-dashboard-cards";
import { AdminDashboardShellFlow } from "@/modules/admin/flows/admin-dashboard-shell-flow";
import { AdminSectionShellFlow } from "@/modules/admin/flows/admin-section-shell-flow";
import { adminSectionDescriptions } from "@/modules/admin/utils/admin-section-descriptions";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";
import { adminNav } from "@/shared/layout/admin-nav";
import { buildAccessDeniedRedirect } from "@/shared/auth/session-guard";

describe("AdminDashboardShellFlow", () => {
  it("composes the dashboard shell with operational area cards", () => {
    const element = AdminDashboardShellFlow();

    expect(element.type).toBe(AdminWorkflowShell);
    expect(element.props).toMatchObject({
      title: "Dashboard",
      module: "admin",
    });
    expect(element.props.children?.type).toBe(AdminDashboardCards);
  });
});

describe("AdminSectionShellFlow", () => {
  it("uses the configured section description from admin navigation metadata", () => {
    const element = AdminSectionShellFlow({
      title: "Pricing",
      module: "pricing",
      href: "/admin/pricing",
    });

    expect(element.type).toBe(AdminWorkflowShell);
    expect(element.props).toMatchObject({
      title: "Pricing",
      module: "pricing",
      description: adminSectionDescriptions["/admin/pricing"],
    });
  });
});

describe("admin navigation", () => {
  it("exposes every required admin destination", () => {
    expect(adminNav.map((item) => item.label)).toEqual([
      "Dashboard",
      "Pricing",
      "Market Status",
      "Orders",
      "Approvals",
      "Payments",
      "Delivery",
      "Ledger",
      "Audit",
      "Reconciliation",
    ]);
  });

  it("describes every non-dashboard admin destination", () => {
    const sectionHrefs = adminNav
      .map((item) => item.href)
      .filter((href) => href !== "/admin/dashboard");

    expect(sectionHrefs.every((href) => adminSectionDescriptions[href])).toBe(true);
  });
});

describe("buildAccessDeniedRedirect", () => {
  it("preserves the requested route and denial reason", () => {
    expect(buildAccessDeniedRedirect("/admin/orders")).toBe(
      "/access-denied?next=%2Fadmin%2Forders&reason=admin_required",
    );
  });
});
