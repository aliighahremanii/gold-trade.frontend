import { expect, test } from "@playwright/test";

import { signInAsAdmin } from "../fixtures/auth";
import { E2E_MOCK_ADMIN } from "../fixtures/test-users";

test.describe("admin pricing and market status", () => {
  test.beforeEach(async ({ page }) => {
    await signInAsAdmin(page, E2E_MOCK_ADMIN, "/admin/pricing");
  });

  test("submits a manual XAU/IRR price with confirmation", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();

    await page.locator("#manual-buy-price").fill("5100000");
    await page.locator("#manual-sell-price").fill("5050000");
    await page.locator("#manual-price-reason").fill("E2E manual price update.");
    await page.getByRole("button", { name: "Review manual price" }).click();
    await page.getByRole("button", { name: "Confirm manual price" }).click();

    await expect(
      page.getByText("Manual price submitted. Refresh pricing data to confirm the backend-selected snapshot."),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("updates market status to manual-only with confirmation", async ({ page }) => {
    await page.goto("/admin/market-status");

    await expect(page.getByRole("heading", { name: "Market status", exact: true })).toBeVisible();
    await page.getByRole("radio", { name: /Manual only/i }).check();
    await page.getByRole("button", { name: "Review status change" }).click();
    await page.getByRole("button", { name: "Confirm status change" }).click();

    await expect(
      page.getByText("Market status change submitted. Refresh to confirm the backend-reported status."),
    ).toBeVisible({ timeout: 15_000 });
  });
});
