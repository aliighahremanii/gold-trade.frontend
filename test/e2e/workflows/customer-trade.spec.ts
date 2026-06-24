import { expect, test } from "@playwright/test";

import { signInAsCustomer } from "../fixtures/auth";
import { E2E_MOCK_CUSTOMER } from "../fixtures/test-users";

test.describe("customer trade workflows", () => {
  test.beforeEach(async ({ page }) => {
    await signInAsCustomer(page, E2E_MOCK_CUSTOMER, "/trade/buy");
  });

  test("buy gold happy path reaches settled backend state", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Buy gold" })).toBeVisible();

    await page.locator("#trade-amount").fill("1");
    await page.getByRole("button", { name: "Get quote" }).click();

    await expect(page.getByRole("heading", { name: "Quote ready" })).toBeVisible();
    await page.getByRole("button", { name: "Review and confirm" }).click();
    await page.getByRole("button", { name: "Confirm order" }).click();

    await expect(page.getByRole("heading", { name: "Order status" })).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText("Order reached a settled backend state. Wallet balances were refreshed from the server."),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("sell gold happy path reaches settled backend state", async ({ page }) => {
    await page.goto("/trade/sell");

    await expect(page.getByRole("heading", { name: "Sell gold" })).toBeVisible();

    await page.locator("#trade-amount").fill("0.5");
    await page.getByRole("button", { name: "Get quote" }).click();

    await expect(page.getByRole("heading", { name: "Quote ready" })).toBeVisible();
    await page.getByRole("button", { name: "Review and confirm" }).click();
    await page.getByRole("button", { name: "Confirm order" }).click();

    await expect(page.getByRole("heading", { name: "Order status" })).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText("Order reached a settled backend state. Wallet balances were refreshed from the server."),
    ).toBeVisible({ timeout: 15_000 });
  });
});
