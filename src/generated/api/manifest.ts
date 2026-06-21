export const apiManifest = {
  "modules": [
    {
      "module": "admin",
      "contract": "contracts/openapi/admin.openapi.json",
      "schema": "src/generated/api/admin/schema.ts",
      "pathPrefix": "/api/admin/v1"
    },
    {
      "module": "asset",
      "contract": "contracts/openapi/asset.openapi.json",
      "schema": "src/generated/api/asset/schema.ts",
      "pathPrefix": "/api/asset/v1"
    },
    {
      "module": "audit",
      "contract": "contracts/openapi/audit.openapi.json",
      "schema": "src/generated/api/audit/schema.ts",
      "pathPrefix": "/api/audit/v1"
    },
    {
      "module": "compliance",
      "contract": "contracts/openapi/compliance.openapi.json",
      "schema": "src/generated/api/compliance/schema.ts",
      "pathPrefix": "/api/compliance/v1"
    },
    {
      "module": "delivery",
      "contract": "contracts/openapi/delivery.openapi.json",
      "schema": "src/generated/api/delivery/schema.ts",
      "pathPrefix": "/api/delivery/v1"
    },
    {
      "module": "identity",
      "contract": "contracts/openapi/identity.openapi.json",
      "schema": "src/generated/api/identity/schema.ts",
      "pathPrefix": "/api/identity/v1"
    },
    {
      "module": "ledger",
      "contract": "contracts/openapi/ledger.openapi.json",
      "schema": "src/generated/api/ledger/schema.ts",
      "pathPrefix": "/api/ledger/v1"
    },
    {
      "module": "liquidity",
      "contract": "contracts/openapi/liquidity.openapi.json",
      "schema": "src/generated/api/liquidity/schema.ts",
      "pathPrefix": "/api/liquidity/v1"
    },
    {
      "module": "notification",
      "contract": "contracts/openapi/notification.openapi.json",
      "schema": "src/generated/api/notification/schema.ts",
      "pathPrefix": "/api/notification/v1"
    },
    {
      "module": "payments",
      "contract": "contracts/openapi/payments.openapi.json",
      "schema": "src/generated/api/payments/schema.ts",
      "pathPrefix": "/api/payments/v1"
    },
    {
      "module": "pricing",
      "contract": "contracts/openapi/pricing.openapi.json",
      "schema": "src/generated/api/pricing/schema.ts",
      "pathPrefix": "/api/pricing/v1"
    },
    {
      "module": "quote",
      "contract": "contracts/openapi/quote.openapi.json",
      "schema": "src/generated/api/quote/schema.ts",
      "pathPrefix": "/api/quote/v1"
    },
    {
      "module": "reconciliation",
      "contract": "contracts/openapi/reconciliation.openapi.json",
      "schema": "src/generated/api/reconciliation/schema.ts",
      "pathPrefix": "/api/reconciliation/v1"
    },
    {
      "module": "settlement",
      "contract": "contracts/openapi/settlement.openapi.json",
      "schema": "src/generated/api/settlement/schema.ts",
      "pathPrefix": "/api/settlement/v1"
    },
    {
      "module": "trading",
      "contract": "contracts/openapi/trading.openapi.json",
      "schema": "src/generated/api/trading/schema.ts",
      "pathPrefix": "/api/trading/v1"
    },
    {
      "module": "wallet",
      "contract": "contracts/openapi/wallet.openapi.json",
      "schema": "src/generated/api/wallet/schema.ts",
      "pathPrefix": "/api/wallet/v1"
    }
  ],
  "compatibilityPatches": [
    {
      "module": "admin",
      "missingSchemas": [
        "ProblemFieldError"
      ]
    },
    {
      "module": "audit",
      "missingSchemas": [
        "ProblemFieldError"
      ]
    },
    {
      "module": "compliance",
      "missingSchemas": [
        "ProblemFieldError"
      ]
    },
    {
      "module": "delivery",
      "missingSchemas": [
        "ProblemFieldError",
        "ProblemResponse"
      ]
    },
    {
      "module": "liquidity",
      "missingSchemas": [
        "ProblemFieldError",
        "ProblemResponse"
      ]
    },
    {
      "module": "payments",
      "missingSchemas": [
        "ProblemFieldError",
        "ProblemResponse"
      ]
    },
    {
      "module": "pricing",
      "missingSchemas": [
        "ProblemFieldError",
        "ProblemResponse"
      ]
    },
    {
      "module": "quote",
      "missingSchemas": [
        "ProblemFieldError",
        "ProblemResponse"
      ]
    },
    {
      "module": "reconciliation",
      "missingSchemas": [
        "ProblemFieldError"
      ]
    },
    {
      "module": "trading",
      "missingSchemas": [
        "ProblemFieldError",
        "ProblemResponse"
      ]
    }
  ]
} as const;
