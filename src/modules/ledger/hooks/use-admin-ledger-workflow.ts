"use client";

import { useQueries } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { getLedgerTransaction } from "@/modules/ledger/api/use-ledger-postings";
import { ledgerQueryKeys } from "@/modules/ledger/api/query-keys";
import { mapLedgerTransactionToAdminView } from "@/modules/ledger/mappers/map-ledger-transaction";
import {
  EMPTY_ADMIN_RECORD_FILTERS,
  matchesAdminRecordFilters,
  parseCommaSeparatedIds,
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

export function useAdminLedgerWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lookupTransactionId, setLookupTransactionId] = useState("");
  const selectedTransactionId = searchParams.get("selected");
  const watchTransactionIds = parseCommaSeparatedIds(searchParams.get("watch"));
  const filters = readFilters(searchParams);

  const transactionQueries = useQueries({
    queries: watchTransactionIds.map((transactionId) => ({
      queryKey: ledgerQueryKeys.transaction(transactionId),
      queryFn: () => getLedgerTransaction(transactionId),
      enabled: Boolean(transactionId),
    })),
  });

  const transactions = useMemo(
    () =>
      transactionQueries
        .map((query) => (query.data ? mapLedgerTransactionToAdminView(query.data) : null))
        .filter((transaction): transaction is NonNullable<typeof transaction> => transaction !== null)
        .filter((transaction) =>
          matchesAdminRecordFilters(
            {
              status: transaction.transactionType,
              updatedAt: transaction.postedAt,
              references: transaction.references,
            },
            filters,
          ),
        ),
    [transactionQueries, filters],
  );

  const selectedTransaction =
    transactions.find((transaction) => transaction.id === selectedTransactionId) ?? null;
  const isLoadingTransactions = transactionQueries.some((query) => query.isLoading);

  function updateSearchParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`/admin/ledger?${params.toString()}`);
  }

  function addTransactionToWatchList(transactionId: string) {
    const trimmed = transactionId.trim();

    if (!trimmed) {
      return;
    }

    const nextWatch = [...new Set([...watchTransactionIds, trimmed])];
    updateSearchParams({ watch: nextWatch.join(","), selected: trimmed });
    setLookupTransactionId("");
  }

  function selectTransaction(transactionId: string) {
    updateSearchParams({ selected: transactionId });
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
    lookupTransactionId,
    selectedTransactionId,
    selectedTransaction,
    transactions,
    watchTransactionIds,
    isLoadingTransactions,
    transactionQueries,
    filters,
    setLookupTransactionId,
    addTransactionToWatchList,
    selectTransaction,
    setFilters,
    resetFilters,
    refresh: () => {
      transactionQueries.forEach((query) => {
        void query.refetch();
      });
    },
  };
}

export { EMPTY_ADMIN_RECORD_FILTERS };
