"use client";

import { useMemo } from "react";

import { AdminAuditDetailPanel } from "@/modules/audit/components/admin-audit-detail-panel";
import { AdminAuditTable } from "@/modules/audit/components/admin-audit-table";
import { useAdminAuditWorkflow } from "@/modules/audit/hooks/use-admin-audit-workflow";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";
import { AdminRecordFilters } from "@/shared/ui/admin-record-filters";
import { DataRefreshStatus } from "@/shared/ui/data-refresh-status";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

export function AdminAuditFlow() {
  const workflow = useAdminAuditWorkflow();

  const lastUpdatedLabel = useMemo(() => {
    const latest = workflow.records
      .map((record) => record.updatedAt ?? record.createdAt)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1);

    return latest ? formatTimestamp(latest) : undefined;
  }, [workflow.records]);

  return (
    <AdminWorkflowShell
      title="Audit"
      module="audit"
      description="Search immutable audit events for sensitive operational actions. Only structured audit fields are shown."
    >
      <div className="flex flex-col gap-6">
        <DataRefreshStatus
          title="Audit data status"
          loadingMessage="Loading audit records..."
          refreshingMessage="Refreshing audit records..."
          errorFallbackMessage="Audit data could not be loaded."
          isLoading={workflow.recordsQuery.isLoading}
          isFetching={workflow.recordsQuery.isFetching || workflow.selectedRecordQuery.isFetching}
          isError={workflow.recordsQuery.isError || workflow.selectedRecordQuery.isError}
          errorMessage={
            workflow.recordsQuery.error instanceof Error
              ? workflow.recordsQuery.error.message
              : workflow.selectedRecordQuery.error instanceof Error
                ? workflow.selectedRecordQuery.error.message
                : undefined
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
            workflow.openRecordByLookup();
          }}
        >
          <div className="min-w-[16rem] flex-1">
            <AuthFormField
              id="admin-audit-lookup"
              label="Open audit record by ID"
              value={workflow.lookupRecordId}
              onChange={(event) => workflow.setLookupRecordId(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Open record
          </button>
        </form>

        <AdminAuditTable
          records={workflow.records}
          selectedRecordId={workflow.selectedRecordId}
          isLoading={workflow.recordsQuery.isLoading}
          onSelectRecord={workflow.selectRecord}
        />

        {workflow.selectedRecord ? (
          <AdminAuditDetailPanel record={workflow.selectedRecord} />
        ) : workflow.selectedRecordId && workflow.selectedRecordQuery.isLoading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
            Loading selected audit record...
          </p>
        ) : null}
      </div>
    </AdminWorkflowShell>
  );
}
