import { expect, test } from "@playwright/test";

test.describe("public pages", () => {
  test("renders the landing page and auth entry points", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Trade Platform" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Public navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("renders the sign-in form", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});
