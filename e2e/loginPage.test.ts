import { test, expect } from "@playwright/test";
import { SeedUsers, SeedUsersType } from "../seedData/data";

test("Login Page has necessary links", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page).toHaveTitle("Login | Youtube A/B Testing");

  const continueWithGoogle = page.locator("text=Continue with google");
  const continueWthGuest = page.locator("text=Continue with guest account");
  const signUpForFree = page.locator("text=Sign up for free");

  const hrefAttributeNullable = await continueWithGoogle.getAttribute("href");

  expect(hrefAttributeNullable).not.toBeNull();

  const hrefAttribute = hrefAttributeNullable!;

  await Promise.all([
    expect(continueWithGoogle).toHaveAttribute("href", hrefAttribute),
    expect(signUpForFree).toHaveAttribute("href", hrefAttribute),
    expect(continueWthGuest).toHaveAttribute("href", "/api/v1/guestLogin"),
  ]);
});

test("Logining in as user with no youtube account", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.locator(`text=${SeedUsersType.NO_CONNECTED_ACCOUNT}`).click();

  await expect(page).toHaveURL(
    `http://localhost:3000/user/${SeedUsers.NO_CONNECTED_ACCOUNT.userId}`
  );
});
    