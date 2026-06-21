import { describe, expect, it } from "vitest";

import { apiManifest } from "@/generated/api";
import { identityQueryKeys } from "@/modules/identity/api/query-keys";
import { walletQueryKeys } from "@/modules/wallet/api/query-keys";
import { getModulePathPrefix } from "@/shared/api";

describe("api contract freeze", () => {
  it("exposes generated module manifest", () => {
    expect(apiManifest.modules.length).toBe(16);
    expect(apiManifest.modules.map((entry) => entry.module)).toContain("identity");
    expect(apiManifest.modules.map((entry) => entry.module)).toContain("wallet");
  });

  it("surfaces allowlisted OpenAPI compatibility patches", () => {
    expect(apiManifest.compatibilityPatches).toEqual([
      { module: "admin", missingSchemas: ["ProblemFieldError"] },
      { module: "audit", missingSchemas: ["ProblemFieldError"] },
      { module: "compliance", missingSchemas: ["ProblemFieldError"] },
      {
        module: "delivery",
        missingSchemas: ["ProblemFieldError", "ProblemResponse"],
      },
      {
        module: "liquidity",
        missingSchemas: ["ProblemFieldError", "ProblemResponse"],
      },
      {
        module: "payments",
        missingSchemas: ["ProblemFieldError", "ProblemResponse"],
      },
      {
        module: "pricing",
        missingSchemas: ["ProblemFieldError", "ProblemResponse"],
      },
      {
        module: "quote",
        missingSchemas: ["ProblemFieldError", "ProblemResponse"],
      },
      { module: "reconciliation", missingSchemas: ["ProblemFieldError"] },
      {
        module: "trading",
        missingSchemas: ["ProblemFieldError", "ProblemResponse"],
      },
    ]);
  });

  it("uses backend module path prefixes", () => {
    expect(getModulePathPrefix("identity")).toBe("/api/identity/v1");
    expect(getModulePathPrefix("wallet")).toBe("/api/wallet/v1");
  });

  it("keeps module-owned deterministic query keys", () => {
    expect(identityQueryKeys.currentUser()).toEqual(["identity", "current-user"]);
    expect(walletQueryKeys.myAccount("acc-1")).toEqual(["wallet", "me", "accounts", "acc-1"]);
  });
});
