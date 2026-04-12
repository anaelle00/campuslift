import { test, expect } from "@playwright/test";
import { loginAs, logout } from "./helpers";

const EMAIL = process.env.E2E_USER_EMAIL ?? "";
const PASSWORD = process.env.E2E_USER_PASSWORD ?? "";

test.skip(!EMAIL || !PASSWORD, "E2E_USER_EMAIL and E2E_USER_PASSWORD must be set in .env.test.local");

test.describe("Auth flow", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome to campuslift/i })).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("password123")).toBeVisible();
    await expect(page.getByRole("button", { name: /^log in$/i })).toBeVisible();
  });

  test("shows error for empty credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /^log in$/i }).click();
    await expect(page.getByText(/please enter your email and password/i)).toBeVisible();
  });

  test("shows error for wrong password", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill(EMAIL);
    await page.getByPlaceholder("password123").fill("wrong-password-xyz");
    await page.getByRole("button", { name: /^log in$/i }).click();
    await expect(page.locator("p.text-red-500, p.text-destructive")).toBeVisible({ timeout: 8_000 });
  });

  test("logs in and reaches dashboard", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await expect(page).toHaveURL(/\/(dashboard|explore|$)/);
    // Navbar should show avatar or dashboard link
    await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
  });

  test("dashboard shows user sections", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /my projects/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^saved projects$/i, level: 2 })).toBeVisible();
  });

  test("logs out and returns to home", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await logout(page);
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
  });
});
