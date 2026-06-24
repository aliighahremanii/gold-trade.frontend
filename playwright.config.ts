import { defineConfig } from "@playwright/test";

const appPort = 3001;
const mockApiPort = Number(process.env.E2E_MOCK_API_PORT ?? 3099);
const mockApiBaseUrl = `http://127.0.0.1:${mockApiPort}`;
const stagingApiBaseUrl = process.env.E2E_API_BASE_URL ?? "https://saba.gold";
const useMockApi = process.env.E2E_MODE !== "backend-real";

const nextAppEnv = useMockApi
  ? {
      NEXT_PUBLIC_API_BASE_URL: mockApiBaseUrl,
      OPENAPI_BASE_URL: mockApiBaseUrl,
    }
  : {
      NEXT_PUBLIC_API_BASE_URL: stagingApiBaseUrl,
      OPENAPI_BASE_URL: stagingApiBaseUrl,
    };

const appStartCommand = process.env.CI
  ? `bun run start -- --hostname 127.0.0.1 --port ${appPort}`
  : `bun run dev -- --hostname 127.0.0.1 --port ${appPort}`;

const projects = [
  {
    name: "smoke",
    testMatch: /smoke\/.*\.spec\.ts/,
  },
  ...(useMockApi
    ? [
        {
          name: "workflows",
          testMatch: /workflows\/.*\.spec\.ts/,
          dependencies: ["smoke"],
        },
      ]
    : []),
  ...(process.env.E2E_MODE === "backend-real"
    ? [
        {
          name: "backend-real",
          testMatch: /backend-real\/.*\.spec\.ts/,
        },
      ]
    : []),
];

export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects,
  webServer: [
    ...(useMockApi
      ? [
          {
            command: "bun run test/e2e/mock-api/server.mjs",
            url: `${mockApiBaseUrl}/health`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
        ]
      : []),
    {
      command: appStartCommand,
      url: `http://127.0.0.1:${appPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: nextAppEnv,
    },
  ],
});
