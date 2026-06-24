import { expect, test } from "@playwright/test";

import { signInAsCustomer } from "../fixtures/auth";
import { E2E_MOCK_CUSTOMER } from "../fixtures/test-users";

test.describe("customer payments workflows", () => {
  test.beforeEach(async ({ page }) => {
    await signInAsCustomer(page, E2E_MOCK_CUSTOMER, "/payments/deposit");
  });

  test("deposit IRR happy path shows backend-confirmed state", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Deposit IRR" })).toBeVisible();

    await page.locator("#deposit-amount").fill("5000000");
    await page.getByRole("button", { name: "Start deposit" }).click();

    await expect(page.getByRole("heading", { name: "Deposit status" })).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText("Backend confirmed the deposit. Wallet balances were refreshed from the server."),
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("dd", { hasText: "confirmed" }).first()).toBeVisible();
  });

  test("withdraw IRR happy path shows pending approval from backend", async ({ page }) => {
    await page.goto("/payments/withdraw");

    await expect(page.getByRole("heading", { name: "Withdraw IRR" })).toBeVisible();

    await page.locator("#withdraw-amount").fill("1000000");
    await page.locator("#bank-account-reference").fill("IR1234567890");
    await page.getByRole("button", { name: "Review withdrawal" }).click();
    await page.getByRole("button", { name: "Confirm withdrawal" }).click();

    await expect(page.getByRole("heading", { name: "Withdrawal status" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("pending_approval", { exact: false })).toBeVisible();
  });
});
