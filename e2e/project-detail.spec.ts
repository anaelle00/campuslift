import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

const EMAIL = process.env.E2E_USER_EMAIL ?? "";
const PASSWORD = process.env.E2E_USER_PASSWORD ?? "";

test.skip(!EMAIL || !PASSWORD, "E2E_USER_EMAIL and E2E_USER_PASSWORD must be set in .env.test.local");

test.describe("Project detail", () => {
  test("explore page lists published projects", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.getByRole("heading", { name: /explore projects/i })).toBeVisible();
  });

  test("search bar is visible on explore page", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.getByPlaceholder(/search projects/i)).toBeVisible();
  });

  test("clicking a project navigates to its detail page", async ({ page }) => {
    await page.goto("/explore");
    const firstCard = page.locator("a[href^='/projects/']").first();
    await expect(firstCard).toBeVisible({ timeout: 8_000 });
    await firstCard.click();
    await expect(page).toHaveURL(/\/projects\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("project detail page shows funding progress and support form", async ({ page }) => {
    await page.goto("/explore");
    const firstCard = page.locator("a[href^='/projects/']").first();
    await firstCard.click();
    await expect(page.getByText(/funding progress/i)).toBeVisible();
    await expect(page.getByPlaceholder(/enter amount/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /support this project/i })).toBeVisible();
  });

  test("support form redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/explore");
    const firstCard = page.locator("a[href^='/projects/']").first();
    await firstCard.click();
    await page.getByRole("button", { name: /support this project/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("favorite button redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/explore");
    const firstCard = page.locator("a[href^='/projects/']").first();
    await firstCard.click();
    await page.getByRole("button", { name: /add to favorites/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("logged-in user can add a comment", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/explore");
    const firstCard = page.locator("a[href^='/projects/']").first();
    await firstCard.click();

    const commentBody = `E2E comment ${Date.now()}`;
    await page.getByPlaceholder(/write a comment/i).fill(commentBody);
    await page.getByRole("button", { name: /post comment/i }).click();

    await expect(page.getByText(commentBody)).toBeVisible({ timeout: 10_000 });
  });

  test("comment section shows discussion heading", async ({ page }) => {
    await page.goto("/explore");
    const firstCard = page.locator("a[href^='/projects/']").first();
    await firstCard.click();
    await expect(page.getByRole("heading", { name: /discussion/i })).toBeVisible();
  });
});
