import { expect, test } from "@playwright/test";

test("redirects unauthenticated customer routes to sign-in", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in\?next=%2Fdashboard&reason=auth_required$/);
});

test("redirects unauthenticated admin routes to sign-in", async ({ page }) => {
  await page.goto("/admin/dashboard");

  await expect(page).toHaveURL(
    /\/sign-in\?next=%2Fadmin%2Fdashboard&reason=admin_required$/,
  );
});