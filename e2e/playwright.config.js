// @ts-check
const { defineConfig, devices } = require("@playwright/test");

// The client is built with a fake API origin; tests/mockApi.js answers every request to it.
const API = "http://api.test/api/v1";
const PORT = 4173;
// Locally you can reuse an installed Chrome instead of downloading one: PW_CHANNEL=chrome npm test
const channel = process.env.PW_CHANNEL || undefined;

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    // The service worker would bypass the API mocks; it is tested separately.
    serviceWorkers: "block",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    cwd: "../client",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { VITE_BACKEND_URL: API },
  },
});
