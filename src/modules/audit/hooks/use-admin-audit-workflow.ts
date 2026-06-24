"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useAuditRecord, useAuditRecords } from "@/modules/audit/api/use-audit-records";
import { mapAuditRecordToAdminView } from "@/modules/audit/mappers/parse-audit-record-response";
import {
  EMPTY_ADMIN_RECORD_FILTERS,
  matchesAdminRecordFilters,
  type AdminRecordFilterState,
} from "@/shared/utils/admin-record-filters";

function readFilters(searchParams: URLSearchParams): AdminRecordFilterState {
  return {
    status: searchParams.get("status") ?? "",
    userId: searchParams.get("user") ?? "",
    reference: searchParams.get("reference") ?? "",
    fromDate: searchParams.get("from") ?? "",
    toDate: searchParams.get("to") ?? "",
  };
}

export function useAdminAuditWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lookupRecordId, setLookupRecordId] = useState("");
  const selectedRecordId = searchParams.get("selected");
  const filters = readFilters(searchParams);

  const recordsQuery = useAuditRecords();
  const selectedRecordQuery = useAuditRecord(selectedRecordId);

  const records = useMemo(
    () =>
      (recordsQuery.data ?? [])
        .map((record) => mapAuditRecordToAdminView(record))
        .filter((record) =>
          matchesAdminRecordFilters(
            {
              status: record.status,
              userId: record.actorId,
              updatedAt: record.updatedAt,
              createdAt: record.createdAt,
              references: record.references,
            },
            filters,
          ),
        ),
    [recordsQuery.data, filters],
  );

  const selectedRecord = useMemo(() => {
    if (selectedRecordQuery.data) {
      return mapAuditRecordToAdminView(selectedRecordQuery.data);
    }

    return records.find((record) => record.id === selectedRecordId) ?? null;
  }, [selectedRecordQuery.data, records, selectedRecordId]);

  function updateSearchParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`/admin/audit?${params.toString()}`);
  }

  function selectRecord(recordId: string) {
    updateSearchParams({ selected: recordId });
  }

  function openRecordByLookup() {
    const trimmed = lookupRecordId.trim();

    if (!trimmed) {
      return;
    }

    updateSearchParams({ selected: trimmed });
    setLookupRecordId("");
  }

  function setFilters(next: AdminRecordFilterState) {
    updateSearchParams({
      status: next.status || null,
      user: next.userId || null,
      reference: next.reference || null,
      from: next.fromDate || null,
      to: next.toDate || null,
    });
  }

  function resetFilters() {
    updateSearchParams({
      status: null,
      user: null,
      reference: null,
      from: null,
      to: null,
    });
  }

  return {
    lookupRecordId,
    selectedRecordId,
    selectedRecord,
    records,
    recordsQuery,
    selectedRecordQuery,
    filters,
    setLookupRecordId,
    selectRecord,
    openRecordByLookup,
    setFilters,
    resetFilters,
    refresh: () => {
      void recordsQuery.refetch();

      if (selectedRecordId) {
        void selectedRecordQuery.refetch();
      }
    },
  };
}

export { EMPTY_ADMIN_RECORD_FILTERS };
