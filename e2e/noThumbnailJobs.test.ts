import { test, expect } from "@playwright/test";
import { SeedUsersType } from "../seedData/data";

test("Should show start A/B testing when no thumbnail jobs are present", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator(`text=${SeedUsersType.NO_THUMBNAIL_JOB_ACCOUNT}`).click();

  const startAbTestingButton = await page.locator("button", {
    hasText: "Start A/B Testing",
  });

  await expect(startAbTestingButton).toBeVisible();
});

test("Clicking 'Start A/B testing should open up the modal` ", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator(`text=${SeedUsersType.NO_THUMBNAIL_JOB_ACCOUNT}`).click();

  debugger;
  await page.locator("text=Start A/B Testing").click();

  const modalTitle = await page.locator(
    "text=Start A/B Testing your thumbnails"
  );

  await expect(modalTitle).toBeVisible();
});

test("Clicking 'close modal' should close modal", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.locator(`text=${SeedUsersType.NO_THUMBNAIL_JOB_ACCOUNT}`).click();

  await page.locator("text=Start A/B Testing").click();

  await page.locator("button", { hasText: "Close the modal" }).click();

  const modalTitle = await page.locator(
    "text=Start A/B Testing your thumbnails"
  );

  await expect(modalTitle).toBeHidden();
});
