import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3200);
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

/**
 * unit    — pure logic (hours, seasons, search, menu schema); no browser
 * desktop — e2e at 1440px Chromium
 * mobile  — e2e on a Pixel 7 profile (412px)
 *
 * E2E runs against a production build: `npm run build` first (npm run verify does this).
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL, trace: "off", timezoneId: "America/New_York" },
  projects: [
    { name: "unit", testDir: "tests/unit" },
    { name: "desktop", testDir: "tests/e2e", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testDir: "tests/e2e", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `npx next start -p ${PORT}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
