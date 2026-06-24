import type { components as ReconciliationComponents } from "@/generated/api/reconciliation";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

type RunDetail = ReconciliationComponents["schemas"]["RunDetail"];
type MismatchDetail = ReconciliationComponents["schemas"]["MismatchDetail"];

const RUN_TYPE_LABELS: Record<string, string> = {
  wallet_ledger: "Wallet vs ledger",
  provider_execution: "Provider vs trades",
  payment: "Bank vs payments",
  delivery: "Physical custody vs liabilities",
};

export function getReconciliationRunTypeLabel(runType?: string): string {
  if (!runType) {
    return "Unknown run type";
  }

  return RUN_TYPE_LABELS[runType] ?? runType;
}

export function mapReconciliationRunToView(run: RunDetail) {
  return {
    id: run.id ?? "unknown",
    runType: run.run_type ?? "unknown",
    runTypeLabel: getReconciliationRunTypeLabel(run.run_type),
    status: run.status ?? "unknown",
    statusLabel: run.status ?? "unknown",
    correlationId: run.correlation_id,
    scopeUserId: run.scope_user_id,
    scopeAssetCode: run.scope_asset_code,
    scopeMarketSymbol: run.scope_market_symbol,
    matchedCount: run.matched_count,
    mismatchCount: run.mismatch_count,
    summary: run.summary,
    startedAt: run.started_at,
    completedAt: run.completed_at,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    startedAtLabel: run.started_at ? formatTimestamp(run.started_at) : undefined,
    completedAtLabel: run.completed_at ? formatTimestamp(run.completed_at) : undefined,
    references: [
      run.id,
      run.correlation_id,
      run.scope_user_id,
      run.scope_internal_ref_id,
      run.scope_external_ref,
    ].filter((value): value is string => Boolean(value)),
  };
}

export type ReconciliationRunView = ReturnType<typeof mapReconciliationRunToView>;

export function mapReconciliationMismatchToView(mismatch: MismatchDetail) {
  return {
    id: mismatch.id ?? "unknown",
    runId: mismatch.run_id,
    mismatchType: mismatch.mismatch_type ?? "unknown",
    status: mismatch.status ?? "unknown",
    statusLabel: mismatch.status ?? "unknown",
    description: mismatch.description,
    expectedValue: mismatch.expected_value,
    actualValue: mismatch.actual_value,
    internalRefType: mismatch.internal_ref_type,
    internalRefId: mismatch.internal_ref_id,
    externalRefType: mismatch.external_ref_type,
    externalRefId: mismatch.external_ref_id,
    providerCode: mismatch.provider_code,
    marketSymbol: mismatch.market_symbol,
    assignedTo: mismatch.assigned_to,
    resolutionNotes: mismatch.resolution_notes,
    createdAt: mismatch.created_at,
    updatedAt: mismatch.updated_at,
    resolvedAt: mismatch.resolved_at,
    createdAtLabel: mismatch.created_at ? formatTimestamp(mismatch.created_at) : undefined,
    references: [
      mismatch.id,
      mismatch.run_id,
      mismatch.internal_ref_id,
      mismatch.external_ref_id,
      mismatch.provider_code,
    ].filter((value): value is string => Boolean(value)),
  };
}

export type ReconciliationMismatchView = ReturnType<typeof mapReconciliationMismatchToView>;
