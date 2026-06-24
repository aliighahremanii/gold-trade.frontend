import { expect, test } from "@playwright/test";

import { signInAsAdmin, signInAsCustomer } from "../fixtures/auth";
import { E2E_MOCK_ADMIN, E2E_MOCK_CUSTOMER } from "../fixtures/test-users";

test.describe("delivery with admin approval", () => {
  test("customer requests delivery and admin approves it", async ({ page, browser }) => {
    test.setTimeout(60_000);

    await signInAsCustomer(page, E2E_MOCK_CUSTOMER, "/delivery/request");

    await expect(page.getByRole("heading", { name: "Request delivery" })).toBeVisible();

    await page.locator("#delivery-amount").fill("1");
    await page.locator("#delivery-zone").selectOption({ index: 1 });
    await page.locator("#delivery-address").fill("Tehran, Example Street 12");
    await page.locator("#recipient-name").fill("E2E Recipient");
    await page.locator("#recipient-phone").fill("+989121112233");
    await page.getByRole("button", { name: "Review delivery request" }).click();
    await page.getByRole("button", { name: "Confirm delivery" }).click();

    await expect(page.getByRole("heading", { name: "Delivery status" })).toBeVisible({ timeout: 15_000 });
    const requestId = (
      await page
        .locator("dt", { hasText: "Request ID" })
        .locator("xpath=following-sibling::dd[1]")
        .textContent()
    )?.trim();
    expect(requestId).toMatch(/^delivery-/);

    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    await signInAsAdmin(adminPage, E2E_MOCK_ADMIN, "/admin/delivery");
    await adminPage.getByLabel("Load delivery request by ID").fill(requestId ?? "");
    await adminPage.getByRole("button", { name: "Add to table" }).click();
    await expect(adminPage.getByRole("button", { name: "Approve request" })).toBeVisible({
      timeout: 15_000,
    });
    await adminPage.getByRole("button", { name: "Approve request" }).click();
    await adminPage.getByLabel("Reason").fill("E2E approval for delivery request.");
    await adminPage.getByRole("button", { name: "Confirm approval" }).click();

    await expect(
      adminPage.getByText("Delivery action submitted. Refresh requests to confirm backend-reported status."),
    ).toBeVisible({ timeout: 15_000 });

    await adminContext.close();
  });
});
