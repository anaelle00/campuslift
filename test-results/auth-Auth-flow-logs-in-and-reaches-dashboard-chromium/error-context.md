# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth flow >> logs in and reaches dashboard
- Location: e2e\auth.spec.ts:32:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1  | import type { Page } from "@playwright/test";
  2  | 
  3  | export async function loginAs(page: Page, email: string, password: string) {
> 4  |   await page.goto("/login");
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  5  |   await page.getByPlaceholder("you@example.com").fill(email);
  6  |   await page.getByPlaceholder("password123").fill(password);
  7  |   await page.getByRole("button", { name: /^log in$/i }).click();
  8  |   await page.waitForURL((url) => !url.pathname.startsWith("/login"), {
  9  |     timeout: 10_000,
  10 |   });
  11 | }
  12 | 
  13 | export async function logout(page: Page) {
  14 |   await page.getByRole("button", { name: /log out/i }).click();
  15 |   await page.waitForURL("/", { timeout: 5_000 });
  16 | }
  17 | 
```