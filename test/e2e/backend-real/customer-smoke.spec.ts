import { expect, test } from "@playwright/test";

import { signInAsCustomer } from "../fixtures/auth";
import { shouldSkipBackendCustomer } from "../fixtures/env";
import { E2E_BACKEND_CUSTOMER } from "../fixtures/test-users";

/**
 * Backend-real smoke checks against the configured staging API.
 * Skipped in default CI unless E2E_MODE=backend-real and credentials are provided.
 */
test.describe("backend-real customer smoke @backend-real", () => {
  test.skip(shouldSkipBackendCustomer(), "Set E2E_MODE=backend-real with customer credentials to run.");

  test("customer can sign in and open the wallet dashboard", async ({ page }) => {
    await signInAsCustomer(page, E2E_BACKEND_CUSTOMER, "/wallet");

    await expect(page.getByRole("heading", { name: /wallet/i })).toBeVisible({ timeout: 20_000 });
  });
});
