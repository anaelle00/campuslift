# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth flow >> shows error for empty credentials
- Location: e2e\auth.spec.ts:18:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { loginAs, logout } from "./helpers";
  3  | 
  4  | const EMAIL = process.env.E2E_USER_EMAIL ?? "";
  5  | const PASSWORD = process.env.E2E_USER_PASSWORD ?? "";
  6  | 
  7  | test.skip(!EMAIL || !PASSWORD, "E2E_USER_EMAIL and E2E_USER_PASSWORD must be set in .env.test.local");
  8  | 
  9  | test.describe("Auth flow", () => {
  10 |   test("login page renders correctly", async ({ page }) => {
  11 |     await page.goto("/login");
  12 |     await expect(page.getByRole("heading", { name: /welcome to campuslift/i })).toBeVisible();
  13 |     await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  14 |     await expect(page.getByPlaceholder("password123")).toBeVisible();
  15 |     await expect(page.getByRole("button", { name: /^log in$/i })).toBeVisible();
  16 |   });
  17 | 
  18 |   test("shows error for empty credentials", async ({ page }) => {
> 19 |     await page.goto("/login");
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  20 |     await page.getByRole("button", { name: /^log in$/i }).click();
  21 |     await expect(page.getByText(/please enter your email and password/i)).toBeVisible();
  22 |   });
  23 | 
  24 |   test("shows error for wrong password", async ({ page }) => {
  25 |     await page.goto("/login");
  26 |     await page.getByPlaceholder("you@example.com").fill(EMAIL);
  27 |     await page.getByPlaceholder("password123").fill("wrong-password-xyz");
  28 |     await page.getByRole("button", { name: /^log in$/i }).click();
  29 |     await expect(page.locator("p.text-red-500, p.text-destructive")).toBeVisible({ timeout: 8_000 });
  30 |   });
  31 | 
  32 |   test("logs in and reaches dashboard", async ({ page }) => {
  33 |     await loginAs(page, EMAIL, PASSWORD);
  34 |     await expect(page).toHaveURL(/\/(dashboard|explore|$)/);
  35 |     // Navbar should show avatar or dashboard link
  36 |     await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
  37 |   });
  38 | 
  39 |   test("dashboard shows user sections", async ({ page }) => {
  40 |     await loginAs(page, EMAIL, PASSWORD);
  41 |     await page.goto("/dashboard");
  42 |     await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  43 |     await expect(page.getByRole("heading", { name: /my projects/i })).toBeVisible();
  44 |     await expect(page.getByRole("heading", { name: /^saved projects$/i, level: 2 })).toBeVisible();
  45 |   });
  46 | 
  47 |   test("logs out and returns to home", async ({ page }) => {
  48 |     await loginAs(page, EMAIL, PASSWORD);
  49 |     await logout(page);
  50 |     await expect(page).toHaveURL("/");
  51 |     await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
  52 |   });
  53 | });
  54 | 
```