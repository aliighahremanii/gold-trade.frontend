import { expect, type Page } from "@playwright/test";

type SignInCredentials = {
  email: string;
  password: string;
};

export async function signIn(page: Page, credentials: SignInCredentials, nextPath?: string) {
  const target = nextPath ? `/sign-in?next=${encodeURIComponent(nextPath)}` : "/sign-in";

  await page.goto(target);
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).not.toHaveURL(/\/sign-in/);
}

export async function signInAsCustomer(
  page: Page,
  credentials: SignInCredentials,
  nextPath = "/dashboard",
) {
  await signIn(page, credentials, nextPath);
  await expect(page).toHaveURL(new RegExp(nextPath.replace(/\//g, "\\/")));
}

export async function signInAsAdmin(page: Page, credentials: SignInCredentials, nextPath = "/admin/dashboard") {
  await signIn(page, credentials, nextPath);
  await expect(page).toHaveURL(new RegExp(nextPath.replace(/\//g, "\\/")));
}

export async function signOut(page: Page) {
  const signOutControl = page.getByRole("button", { name: /sign out/i });

  if (await signOutControl.isVisible()) {
    await signOutControl.click();
    await expect(page).toHaveURL(/\/sign-in/);
  }
}
