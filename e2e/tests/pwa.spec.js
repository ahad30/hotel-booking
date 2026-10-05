const { test, expect } = require("@playwright/test");
const { mockApi } = require("./mockApi");

test.use({ serviceWorkers: "allow" });

test("installable: manifest and icons are served", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  const manifest = await (await request.get(href)).json();
  expect(manifest.display).toBe("standalone");
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).ok()).toBeTruthy();
  }
});

test("service worker keeps the app usable offline", async ({ page, context }) => {
  await mockApi(page);
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  // Reload once so the worker controls the page and caches the shell.
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  // Pages already opened keep working from the cache.
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // A page never opened explains that it needs a connection instead of a 404.
  await page.goto("/compare");
  await expect(page.getByRole("heading", { name: "You're offline" })).toBeVisible();
  await context.setOffline(false);
});
