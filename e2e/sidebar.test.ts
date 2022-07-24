import { test, expect } from "@playwright/test";
import { SeedUsersType } from "../seedData/user";

test("Logging out from the sidebar", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.locator(`text=${SeedUsersType.NO_CONNECTED_ACCOUNT}`).click();

  await page.locator("text=Logout").click();

  await expect(page).toHaveURL("http://localhost:3000/");
});
