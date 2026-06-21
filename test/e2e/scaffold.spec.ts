import { expect, test } from "@playwright/test";

test("preserves deep customer routes when redirecting unauthenticated users to sign-in", async ({
  page,
}) => {
  await page.goto("/delivery/abc-123?step=confirm");

  await expect(page).toHaveURL(
    /\/sign-in\?next=%2Fdelivery%2Fabc-123%3Fstep%3Dconfirm&reason=auth_required$/,
  );
  await expect(page.getByText("After sign-in, continue to /delivery/abc-123?step=confirm.")).toBeVisible();
});

test("redirects unauthenticated admin routes to sign-in", async ({ page }) => {
  await page.goto("/admin/orders?filter=pending");

  await expect(page).toHaveURL(
    /\/sign-in\?next=%2Fadmin%2Forders%3Ffilter%3Dpending&reason=auth_required$/,
  );
  await expect(
    page.getByText("After sign-in, continue to /admin/orders?filter=pending."),
  ).toBeVisible();
});