import { expect, test } from "@playwright/test";

import { signInAsAdmin } from "../fixtures/auth";
import { E2E_MOCK_ADMIN } from "../fixtures/test-users";

test.describe("admin audit visibility", () => {
  test.beforeEach(async ({ page }) => {
    await signInAsAdmin(page, E2E_MOCK_ADMIN, "/admin/audit");
  });

  test("lists seeded audit records and opens detail", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Audit", exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: "audit-1" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("cell", { name: "set_manual_price" })).toBeVisible();

    await page
      .getByRole("row", { name: /audit-1/ })
      .getByRole("button", { name: "Open", exact: true })
      .click();

    const detail = page.getByLabel("Audit record detail");
    await expect(detail.getByRole("heading", { name: "Audit record" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(detail.getByText("E2E seeded audit event")).toBeVisible();
    await expect(detail.getByText("recorded", { exact: true })).toBeVisible();
  });

  test("opens audit record by ID lookup", async ({ page }) => {
    await page.getByLabel("Open audit record by ID").fill("audit-2");
    await page.getByRole("button", { name: "Open record" }).click();

    const detail = page.getByLabel("Audit record detail");
    await expect(detail.getByRole("heading", { name: "Audit record" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(detail.getByText("approve_delivery")).toBeVisible();
    await expect(detail.getByText("delivery-seed-1")).toBeVisible();
  });
});
