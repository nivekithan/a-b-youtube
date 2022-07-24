import { test, expect } from "@playwright/test";
import { SeedUsers, SeedUsersType } from "../seedData/data";

test("Logging out from the sidebar", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.locator(`text=${SeedUsersType.NO_CONNECTED_ACCOUNT}`).click();

  await page.locator("text=Logout").click();

  await expect(page).toHaveURL("http://localhost:3000/");
});

test("Clicking home should redirect to home url", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.locator(`text=${SeedUsersType.NO_CONNECTED_ACCOUNT}`).click();

  await page.locator("text=Home").click();

  await expect(page).toHaveURL(
    `http://localhost:3000/user/${SeedUsers.NO_CONNECTED_ACCOUNT.userId}`
  );
});
