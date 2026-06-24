import { expect, test } from "@playwright/test";

import { signInAsAdmin } from "../fixtures/auth";
import { E2E_MOCK_ADMIN, E2E_MOCK_CUSTOMER } from "../fixtures/test-users";

test.describe("admin reconciliation visibility", () => {
  test.beforeEach(async ({ page }) => {
    await signInAsAdmin(page, E2E_MOCK_ADMIN, "/admin/reconciliation");
  });

  test("shows seeded runs and mismatches", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Reconciliation", exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: "run-seed-1" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("cell", { name: "Wallet vs ledger" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "mm-seed-1" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "balance_delta" })).toBeVisible();
  });

  test("starts wallet-ledger comparison and resolves a mismatch", async ({ page }) => {
    await page.locator("#wallet-user-id").fill(E2E_MOCK_CUSTOMER.userId);
    await page.getByRole("button", { name: "Start comparison" }).first().click();

    await expect(
      page.getByText("Reconciliation action submitted. Refresh data to confirm backend-reported status."),
    ).toBeVisible({ timeout: 15_000 });

    await page
      .getByRole("row", { name: /mm-seed-1/ })
      .getByRole("button", { name: "Open" })
      .click();
    await expect(page.getByRole("heading", { name: "Reconciliation mismatch" })).toBeVisible({
      timeout: 15_000,
    });

    await page.getByRole("button", { name: "Resolve mismatch" }).click();
    await page.getByLabel("Reason").fill("E2E reconciliation review complete.");
    await page.getByRole("button", { name: "Confirm resolution" }).click();

    await expect(
      page.getByText("Reconciliation action submitted. Refresh data to confirm backend-reported status."),
    ).toBeVisible({ timeout: 15_000 });
  });
});
