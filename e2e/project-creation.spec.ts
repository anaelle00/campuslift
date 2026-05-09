import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

const EMAIL = process.env.E2E_USER_EMAIL ?? "";
const PASSWORD = process.env.E2E_USER_PASSWORD ?? "";

test.skip(!EMAIL || !PASSWORD, "E2E_USER_EMAIL and E2E_USER_PASSWORD must be set in .env.test.local");

test.describe("Project creation", () => {
  test("create page is accessible when logged in", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/create");
    await expect(page.getByRole("heading", { name: /start a project/i })).toBeVisible();
  });

  test("/create shows the form when not authenticated (auth enforced on submit)", async ({ page }) => {
    await page.goto("/create");
    await expect(page.getByLabel(/project title/i)).toBeVisible();
  });

  test("create form has all required fields", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/create");
    await expect(page.getByLabel(/project title/i)).toBeVisible();
    await expect(page.getByLabel(/short description/i)).toBeVisible();
    await expect(page.getByLabel(/full description/i)).toBeVisible();
    await expect(page.getByLabel(/funding goal/i)).toBeVisible();
    await expect(page.getByLabel(/deadline/i)).toBeVisible();
  });

  test("shows validation error when submitting empty form", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/create");
    await page.getByRole("button", { name: /publish project/i }).click();
    await expect(page.getByText(/please fill in all required fields/i)).toBeVisible();
  });

  test("save as draft button is present", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/create");
    await expect(page.getByRole("button", { name: /save as draft/i })).toBeVisible();
  });

  test("creates a project and lands on dashboard or explore", async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD);
    await page.goto("/create");

    const title = `E2E Test Project ${Date.now()}`;
    await page.getByLabel(/project title/i).fill(title);
    await page.getByLabel(/short description/i).fill("E2E short description");
    await page.getByLabel(/full description/i).fill("This is a full description written by the E2E test suite.");
    await page.getByLabel(/owner name/i).fill("E2E Tester");
    await page.getByLabel(/funding goal/i).fill("100");
    await page.getByLabel(/deadline/i).fill("2027-12-31");

    await page.getByRole("button", { name: /publish project/i }).click();
    await expect(page).toHaveURL(/\/(explore|dashboard)/, { timeout: 15_000 });
  });
});
