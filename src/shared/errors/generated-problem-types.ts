import type { components as AdminComponents } from "@/generated/api/admin";
import type { components as AuditComponents } from "@/generated/api/audit";
import type { components as ComplianceComponents } from "@/generated/api/compliance";
import type { components as DeliveryComponents } from "@/generated/api/delivery";
import type { components as IdentityComponents } from "@/generated/api/identity";
import type { components as LedgerComponents } from "@/generated/api/ledger";
import type { components as LiquidityComponents } from "@/generated/api/liquidity";
import type { components as NotificationComponents } from "@/generated/api/notification";
import type { components as PaymentsComponents } from "@/generated/api/payments";
import type { components as PricingComponents } from "@/generated/api/pricing";
import type { components as QuoteComponents } from "@/generated/api/quote";
import type { components as ReconciliationComponents } from "@/generated/api/reconciliation";
import type { components as SettlementComponents } from "@/generated/api/settlement";
import type { components as TradingComponents } from "@/generated/api/trading";
import type { components as WalletComponents } from "@/generated/api/wallet";

export type GeneratedProblemFieldError =
  | AdminComponents["schemas"]["ProblemFieldError"]
  | AuditComponents["schemas"]["ProblemFieldError"]
  | ComplianceComponents["schemas"]["ProblemFieldError"]
  | DeliveryComponents["schemas"]["ProblemFieldError"]
  | IdentityComponents["schemas"]["ProblemFieldError"]
  | LedgerComponents["schemas"]["ProblemFieldError"]
  | LiquidityComponents["schemas"]["ProblemFieldError"]
  | NotificationComponents["schemas"]["ProblemFieldError"]
  | PaymentsComponents["schemas"]["ProblemFieldError"]
  | PricingComponents["schemas"]["ProblemFieldError"]
  | QuoteComponents["schemas"]["ProblemFieldError"]
  | ReconciliationComponents["schemas"]["ProblemFieldError"]
  | SettlementComponents["schemas"]["ProblemFieldError"]
  | TradingComponents["schemas"]["ProblemFieldError"]
  | WalletComponents["schemas"]["ProblemFieldError"];

export type GeneratedProblemResponse =
  | AdminComponents["schemas"]["ProblemResponse"]
  | AuditComponents["schemas"]["ProblemResponse"]
  | ComplianceComponents["schemas"]["ProblemResponse"]
  | DeliveryComponents["schemas"]["ProblemResponse"]
  | IdentityComponents["schemas"]["ProblemResponse"]
  | LedgerComponents["schemas"]["ProblemResponse"]
  | LiquidityComponents["schemas"]["ProblemResponse"]
  | NotificationComponents["schemas"]["ProblemResponse"]
  | PaymentsComponents["schemas"]["ProblemResponse"]
  | PricingComponents["schemas"]["ProblemResponse"]
  | QuoteComponents["schemas"]["ProblemResponse"]
  | ReconciliationComponents["schemas"]["ProblemResponse"]
  | SettlementComponents["schemas"]["ProblemResponse"]
  | TradingComponents["schemas"]["ProblemResponse"]
  | WalletComponents["schemas"]["ProblemResponse"];