import { expect, test } from "@playwright/test";

import { signInAsCustomer } from "../fixtures/auth";
import { E2E_MOCK_CUSTOMER } from "../fixtures/test-users";

test.describe("failure-state workflows", () => {
  test("shows expired quote guidance when the backend quote is already expired", async ({ page }) => {
    await signInAsCustomer(page, E2E_MOCK_CUSTOMER, "/trade/buy");

    await page.locator("#trade-amount").fill("7.777");
    await page.getByRole("button", { name: "Get quote" }).click();

    await expect(page.getByText("Request a new quote before confirming.")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: "Review and confirm" })).toBeDisabled();
  });

  test("shows field-level deposit validation before creating a payment", async ({ page }) => {
    await signInAsCustomer(page, E2E_MOCK_CUSTOMER, "/payments/deposit");

    await page.getByRole("button", { name: "Start deposit" }).click();

    await expect(page.getByText("Enter a valid IRR amount in whole rials.")).toBeVisible();
    await expect(page.locator("#deposit-amount")).toHaveAttribute("aria-invalid", "true");
  });

  test("shows manual review messaging for pending withdrawal approval", async ({ page }) => {
    await signInAsCustomer(page, E2E_MOCK_CUSTOMER, "/payments/withdraw");

    await page.locator("#withdraw-amount").fill("1000000");
    await page.locator("#bank-account-reference").fill("IR1234567890");
    await page.getByRole("button", { name: "Review withdrawal" }).click();
    await page.getByRole("button", { name: "Confirm withdrawal" }).click();

    await expect(page.getByText("Manual review is required before this withdrawal can be paid out.")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("pending_approval")).toBeVisible();
  });

  test("shows field-level delivery validation before opening confirmation", async ({ page }) => {
    await signInAsCustomer(page, E2E_MOCK_CUSTOMER, "/delivery/request");

    await page.getByRole("button", { name: "Review delivery request" }).click();

    await expect(page.getByText("Enter a valid gold amount in grams greater than zero.")).toBeVisible();
    await expect(page.getByText("Select a delivery zone.")).toBeVisible();
    await expect(page.getByText("Enter the delivery address.")).toBeVisible();
  });
});
