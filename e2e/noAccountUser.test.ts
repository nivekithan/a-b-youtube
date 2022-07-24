import { test, expect } from "@playwright/test";
import { SeedUsersType } from "../seedData/data";

test("Connect your youtube account should open up google for oauth access", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator(`text=${SeedUsersType.NO_CONNECTED_ACCOUNT}`).click();

  await page.locator(`text=Connect Your Youtube account`).click();

  await expect(page).toHaveURL(
    new RegExp("^https://accounts.google.com/o/oauth2/v2/auth")
  );
});
