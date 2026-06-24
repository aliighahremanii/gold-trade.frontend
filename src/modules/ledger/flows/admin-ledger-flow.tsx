"use client";

import { useMemo } from "react";

import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { AdminLedgerTransactionDetailPanel } from "@/modules/ledger/components/admin-ledger-transaction-detail-panel";
import { AdminLedgerTransactionTable } from "@/modules/ledger/components/admin-ledger-transaction-table";
import { useAdminLedgerWorkflow } from "@/modules/ledger/hooks/use-admin-ledger-workflow";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";
import { AdminRecordFilters } from "@/shared/ui/admin-record-filters";
import { DataRefreshStatus } from "@/shared/ui/data-refresh-status";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

export function AdminLedgerFlow() {
  const workflow = useAdminLedgerWorkflow();

  const lastUpdatedLabel = useMemo(() => {
    const latest = workflow.transactions
      .map((transaction) => transaction.postedAt)
      .sort()
      .at(-1);

    return latest ? formatTimestamp(latest) : undefined;
  }, [workflow.transactions]);

  const hasQueryError = workflow.transactionQueries.some((query) => query.isError);
  const queryErrorMessage = workflow.transactionQueries.find((query) => query.error)?.error;

  return (
    <AdminWorkflowShell
      title="Ledger"
      module="ledger"
      description="Inspect ledger postings and entry effects as reported by the backend. This view is read-only."
    >
      <div className="flex flex-col gap-6">
        <DataRefreshStatus
          title="Ledger data status"
          loadingMessage="Loading ledger transactions..."
          refreshingMessage="Refreshing ledger transactions..."
          errorFallbackMessage="Ledger data could not be loaded."
          isLoading={workflow.isLoadingTransactions}
          isFetching={workflow.transactionQueries.some((query) => query.isFetching)}
          isError={hasQueryError}
          errorMessage={
            queryErrorMessage instanceof Error ? queryErrorMessage.message : undefined
          }
          lastUpdatedLabel={lastUpdatedLabel}
          onRefresh={workflow.refresh}
        />

        <AdminRecordFilters
          filters={workflow.filters}
          onChange={workflow.setFilters}
          onReset={workflow.resetFilters}
        />

        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            workflow.addTransactionToWatchList(workflow.lookupTransactionId);
          }}
        >
          <div className="min-w-[16rem] flex-1">
            <AuthFormField
              id="admin-ledger-lookup"
              label="Load ledger posting by ID"
              value={workflow.lookupTransactionId}
              onChange={(event) => workflow.setLookupTransactionId(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Add to table
          </button>
        </form>

        <AdminLedgerTransactionTable
          transactions={workflow.transactions}
          selectedTransactionId={workflow.selectedTransactionId}
          isLoading={workflow.isLoadingTransactions}
          onSelectTransaction={workflow.selectTransaction}
        />

        {workflow.selectedTransaction ? (
          <AdminLedgerTransactionDetailPanel transaction={workflow.selectedTransaction} />
        ) : null}
      </div>
    </AdminWorkflowShell>
  );
}
