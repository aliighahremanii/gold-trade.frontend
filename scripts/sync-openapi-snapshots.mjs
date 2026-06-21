#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "contracts", "openapi");

/** Default staging API used by the frontend team for contract sync and integration. */
const DEFAULT_STAGING_API_BASE_URL = "https://saba.gold";

const apiModules = [
  "identity",
  "asset",
  "wallet",
  "pricing",
  "quote",
  "trading",
  "settlement",
  "payments",
  "delivery",
  "admin",
  "audit",
  "compliance",
  "reconciliation",
  "ledger",
  "notification",
  "liquidity",
];

function getOpenApiUrl(baseUrl, moduleName) {
  return new URL(`/api/${moduleName}/v1/openapi.json`, baseUrl).toString();
}

async function fetchSnapshotsFromApi(baseUrl) {
  await mkdir(outputDir, { recursive: true });

  for (const moduleName of apiModules) {
    const url = getOpenApiUrl(baseUrl, moduleName);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const document = await response.json();
    const target = path.join(outputDir, `${moduleName}.openapi.json`);
    await writeFile(target, `${JSON.stringify(document, null, 2)}\n`, "utf8");
    console.log(`fetched ${url}`);
  }
}

async function main() {
  const baseUrl = (
    process.env.OPENAPI_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_STAGING_API_BASE_URL
  ).replace(/\/$/, "");

  await fetchSnapshotsFromApi(baseUrl);
  console.log(`Synced ${apiModules.length} OpenAPI snapshots from ${baseUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
