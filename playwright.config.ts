import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 10_000
  },
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  outputDir: "test-results",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  retries: process.env.CI ? 2 : 0,
  testDir: "e2e",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure"
  },
  webServer: [
    {
      command: "./node_modules/.bin/next dev --hostname 127.0.0.1",
      cwd: "apps/web",
      reuseExistingServer: false,
      stderr: "pipe",
      stdout: "pipe",
      timeout: 120_000,
      url: "http://127.0.0.1:3000/api/health"
    },
    {
      command: "./node_modules/.bin/tsx src/index.ts",
      cwd: "apps/worker",
      reuseExistingServer: false,
      stderr: "pipe",
      stdout: "pipe",
      timeout: 120_000,
      url: "http://127.0.0.1:3001/health"
    }
  ],
  workers: 1
});
