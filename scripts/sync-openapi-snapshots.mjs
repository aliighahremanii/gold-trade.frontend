#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "contracts", "openapi");
const backendRoot = process.env.BACKEND_ROOT ?? path.resolve(repoRoot, "..", "gold-trade");
const exporterMain = path.join(repoRoot, "scripts", "openapi-export", "main.go");
const backendExporterDir = path.join(backendRoot, "cmd", "frontend-openapi-export");

const mvpModules = [
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
];

async function fetchSnapshotsFromApi(baseUrl) {
  await mkdir(outputDir, { recursive: true });

  for (const moduleName of mvpModules) {
    const url = new URL(`/api/${moduleName}/v1/openapi.json`, baseUrl);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    const document = await response.json();
    const target = path.join(outputDir, `${moduleName}.openapi.json`);
    await writeFile(target, `${JSON.stringify(document, null, 2)}\n`, "utf8");
    console.log(`fetched ${target}`);
  }
}

function exportSnapshotsFromBackend() {
  if (!existsSync(backendRoot)) {
    throw new Error(
      `Backend repository not found at ${backendRoot}. Set BACKEND_ROOT or start the API and use OPENAPI_BASE_URL.`,
    );
  }

  mkdirSyncSafe(backendExporterDir);
  const copyResult = spawnSync("cp", [exporterMain, path.join(backendExporterDir, "main.go")], {
    stdio: "inherit",
  });

  if (copyResult.status !== 0) {
    throw new Error("Failed to stage backend OpenAPI exporter.");
  }

  const runResult = spawnSync("go", ["run", "./cmd/frontend-openapi-export", outputDir], {
    cwd: backendRoot,
    stdio: "inherit",
  });

  spawnSync("rm", ["-rf", backendExporterDir], { cwd: backendRoot, stdio: "inherit" });

  if (runResult.status !== 0) {
    throw new Error("Backend OpenAPI export failed.");
  }
}

function mkdirSyncSafe(target) {
  if (!existsSync(target)) {
    spawnSync("mkdir", ["-p", target], { stdio: "inherit" });
  }
}

async function main() {
  const mode = process.argv.includes("--check") ? "check" : "sync";
  const baseUrl = process.env.OPENAPI_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (mode === "check") {
    if (!baseUrl) {
      console.log("Skipping live OpenAPI snapshot check because OPENAPI_BASE_URL is unset.");
      return;
    }
  }

  if (baseUrl) {
    await fetchSnapshotsFromApi(baseUrl);
    return;
  }

  exportSnapshotsFromBackend();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
