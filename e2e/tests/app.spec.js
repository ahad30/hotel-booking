const { test, expect } = require("@playwright/test");
const { mockApi, hotel, hotels } = require("./mockApi");

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("home page lists hotels and opens one", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const card = page.locator(`a[href="/hotel-details/${hotel.data.id}"]`).first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page).toHaveURL(new RegExp(`/hotel-details/${hotel.data.id}`));
  await expect(page.getByRole("heading", { name: hotel.data.name, level: 1 })).toBeVisible();
});

test("switches to Bangla and remembers the choice", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to Bangla" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "bn");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "bn");
  await expect(page.getByRole("button", { name: "Switch to English" })).toBeVisible();
});

test("trip assistant shows what it understood and links with the dates", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: /family of 4 in sylhet/i });
  await input.scrollIntoViewIfNeeded();
  await input.fill("Family of 4 in Chattogram under 6000 with a pool this weekend");
  await input.press("Enter");

  await expect(page.getByText("We understood")).toBeVisible();
  const understood = page.getByRole("list", { name: "How we understood your request" });
  await expect(understood.getByText("Chattagram")).toBeVisible();
  await expect(understood.getByText("Swimming Pool")).toBeVisible();
  await expect(page.getByRole("link", { name: /view & book/i })).toHaveAttribute(
    "href",
    `/hotel-details/${hotel.data.id}?checkIn=2026-10-09&checkOut=2026-10-11`
  );
});

test("hotel page: calendar, pick a room, reserving asks to log in", async ({ page }) => {
  await page.goto(`/hotel-details/${hotel.data.id}`);
  await expect(page.getByRole("heading", { name: "Choose your room" })).toBeVisible();

  // The mocked calendar has one fully booked night.
  await expect(page.getByRole("button", { name: /fully booked/ })).toHaveCount(1);

  await page.getByRole("button", { name: "Select room" }).first().click();
  await expect(page.getByRole("button", { name: "Remove" }).first()).toBeVisible();

  await page.getByRole("button", { name: /^Reserve/ }).first().click();
  await expect(page).toHaveURL(/\/login/);
});

test("compare two hotels side by side", async ({ page }) => {
  test.skip(hotels.data.length < 2, "needs two hotels in the fixtures");
  await page.goto("/hotels");
  for (const h of hotels.data.slice(0, 2)) {
    await page.getByRole("button", { name: `Compare ${h.name}` }).first().click();
  }

  await page.goto("/compare");
  for (const h of hotels.data.slice(0, 2)) {
    await expect(page.getByText(h.name).first()).toBeVisible();
  }
});

for (const route of ["/", "/hotels", `/hotel-details/${hotel.data.id}`, "/compare", "/login"]) {
  test(`no sideways scrolling on ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
