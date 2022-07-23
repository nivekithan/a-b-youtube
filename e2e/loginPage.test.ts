import { test, expect } from "@playwright/test";

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
