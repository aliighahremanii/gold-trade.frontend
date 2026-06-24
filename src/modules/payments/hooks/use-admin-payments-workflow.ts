"use client";

import { useQueries } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  useApproveWithdrawal,
  useCompleteWithdrawal,
  useConfirmDeposit,
  useRejectWithdrawal,
} from "@/modules/admin/api/use-admin-payments";
import { useReviewCases } from "@/modules/compliance/api/use-review-cases";
import {
  extractDepositIdFromReviewCase,
  extractWithdrawalIdFromReviewCase,
} from "@/modules/compliance/utils/parse-review-case-response";
import { getDeposit } from "@/modules/payments/api/use-deposits";
import { paymentsQueryKeys } from "@/modules/payments/api/query-keys";
import { getWithdrawal } from "@/modules/payments/api/use-withdrawals";
import { mapDepositDetailToAdminView } from "@/modules/payments/mappers/map-deposit-admin-view";
import { mapWithdrawalDetailToAdminView } from "@/modules/payments/mappers/map-withdrawal-admin-view";
import { toNormalizedApiError } from "@/shared/errors";
import {
  EMPTY_ADMIN_RECORD_FILTERS,
  matchesAdminRecordFilters,
  parseCommaSeparatedIds,
  type AdminRecordFilterState,
} from "@/shared/utils/admin-record-filters";

type PaymentsModalAction =
  | "confirm-deposit"
  | "approve-withdrawal"
  | "reject-withdrawal"
  | "complete-withdrawal"
  | null;

function readFilters(searchParams: URLSearchParams): AdminRecordFilterState {
  return {
    status: searchParams.get("status") ?? "",
    userId: searchParams.get("user") ?? "",
    reference: searchParams.get("reference") ?? "",
    fromDate: searchParams.get("from") ?? "",
    toDate: searchParams.get("to") ?? "",
  };
}

export function useAdminPaymentsWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lookupDepositId, setLookupDepositId] = useState("");
  const [lookupWithdrawalId, setLookupWithdrawalId] = useState("");
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [pendingAction, setPendingAction] = useState<PaymentsModalAction>(null);
  const [reason, setReason] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [reconciliationReference, setReconciliationReference] = useState("");
  const [bankTransferReference, setBankTransferReference] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitted">("idle");

  const selectedDepositId = searchParams.get("selectedDeposit");
  const selectedWithdrawalId = searchParams.get("selectedWithdrawal");
  const watchDepositIds = parseCommaSeparatedIds(searchParams.get("watchDeposits"));
  const watchWithdrawalIds = parseCommaSeparatedIds(searchParams.get("watchWithdrawals"));
  const filters = readFilters(searchParams);

  const reviewCasesQuery = useReviewCases();
  const confirmDepositMutation = useConfirmDeposit();
  const approveWithdrawalMutation = useApproveWithdrawal();
  const rejectWithdrawalMutation = useRejectWithdrawal();
  const completeWithdrawalMutation = useCompleteWithdrawal();

  const queueDepositIds = useMemo(() => {
    const fromReviewCases = (reviewCasesQuery.data ?? [])
      .map((reviewCase) => extractDepositIdFromReviewCase(reviewCase))
      .filter((depositId): depositId is string => Boolean(depositId));

    return [...new Set([...watchDepositIds, ...fromReviewCases])];
  }, [reviewCasesQuery.data, watchDepositIds]);

  const queueWithdrawalIds = useMemo(() => {
    const fromReviewCases = (reviewCasesQuery.data ?? [])
      .map((reviewCase) => extractWithdrawalIdFromReviewCase(reviewCase))
      .filter((withdrawalId): withdrawalId is string => Boolean(withdrawalId));

    return [...new Set([...watchWithdrawalIds, ...fromReviewCases])];
  }, [reviewCasesQuery.data, watchWithdrawalIds]);

  const depositQueries = useQueries({
    queries: queueDepositIds.map((depositId) => ({
      queryKey: paymentsQueryKeys.deposit(depositId),
      queryFn: () => getDeposit(depositId),
      enabled: Boolean(depositId),
    })),
  });

  const withdrawalQueries = useQueries({
    queries: queueWithdrawalIds.map((withdrawalId) => ({
      queryKey: paymentsQueryKeys.withdrawal(withdrawalId),
      queryFn: () => getWithdrawal(withdrawalId),
      enabled: Boolean(withdrawalId),
    })),
  });

  const deposits = useMemo(
    () =>
      depositQueries
        .map((query) => (query.data ? mapDepositDetailToAdminView(query.data) : null))
        .filter((deposit): deposit is NonNullable<typeof deposit> => deposit !== null)
        .filter((deposit) =>
          matchesAdminRecordFilters(
            {
              status: deposit.status,
              userId: deposit.userId,
              updatedAt: deposit.updatedAt,
              createdAt: deposit.createdAt,
              references: [
                deposit.id,
                deposit.bankReference,
                deposit.gatewayReference,
                deposit.gatewayTrackingCode,
                deposit.reconciliationReference,
                deposit.settlementId,
              ],
            },
            filters,
          ),
        ),
    [depositQueries, filters],
  );

  const withdrawals = useMemo(
    () =>
      withdrawalQueries
        .map((query) => (query.data ? mapWithdrawalDetailToAdminView(query.data) : null))
        .filter((withdrawal): withdrawal is NonNullable<typeof withdrawal> => withdrawal !== null)
        .filter((withdrawal) =>
          matchesAdminRecordFilters(
            {
              status: withdrawal.status,
              userId: withdrawal.userId,
              updatedAt: withdrawal.updatedAt,
              createdAt: withdrawal.createdAt,
              references: [
                withdrawal.id,
                withdrawal.bankAccountReference,
                withdrawal.bankTransferReference,
                withdrawal.reconciliationReference,
                withdrawal.settlementId,
              ],
            },
            filters,
          ),
        ),
    [withdrawalQueries, filters],
  );

  const selectedDeposit = deposits.find((deposit) => deposit.id === selectedDepositId) ?? null;
  const selectedWithdrawal =
    withdrawals.find((withdrawal) => withdrawal.id === selectedWithdrawalId) ?? null;

  const isLoadingDeposits = reviewCasesQuery.isLoading || depositQueries.some((query) => query.isLoading);
  const isLoadingWithdrawals =
    reviewCasesQuery.isLoading || withdrawalQueries.some((query) => query.isLoading);

  const isSubmitting =
    confirmDepositMutation.isPending ||
    approveWithdrawalMutation.isPending ||
    rejectWithdrawalMutation.isPending ||
    completeWithdrawalMutation.isPending;

  function updateSearchParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`/admin/payments?${params.toString()}`);
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
    setFilters(EMPTY_ADMIN_RECORD_FILTERS);
  }

  function addDepositToWatchList(depositId: string) {
    const trimmed = depositId.trim();

    if (!trimmed) {
      return;
    }

    const nextWatch = [...new Set([...watchDepositIds, trimmed])];
    updateSearchParams({
      watchDeposits: nextWatch.join(","),
      selectedDeposit: trimmed,
    });
    setLookupDepositId("");
  }

  function addWithdrawalToWatchList(withdrawalId: string) {
    const trimmed = withdrawalId.trim();

    if (!trimmed) {
      return;
    }

    const nextWatch = [...new Set([...watchWithdrawalIds, trimmed])];
    updateSearchParams({
      watchWithdrawals: nextWatch.join(","),
      selectedWithdrawal: trimmed,
    });
    setLookupWithdrawalId("");
  }

  function openActionModal(action: Exclude<PaymentsModalAction, null>) {
    setActionError(null);
    setReason("");
    setBankReference("");
    setReconciliationReference("");
    setBankTransferReference("");
    setPendingAction(action);
  }

  function closeActionModal() {
    if (!isSubmitting) {
      setPendingAction(null);
    }
  }

  async function confirmAction() {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "A reason is required before submitting an admin payment action.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    setActionError(null);

    try {
      if (pendingAction === "confirm-deposit") {
        if (!selectedDepositId) {
          return;
        }

        const trimmedBankReference = bankReference.trim();

        if (!trimmedBankReference) {
          setActionError({
            kind: "validation_error",
            status: 400,
            message: "Bank reference is required to confirm a deposit.",
            code: "validation_error",
            fieldErrors: [],
          });
          return;
        }

        await confirmDepositMutation.mutateAsync({
          depositId: selectedDepositId,
          body: {
            bank_reference: trimmedBankReference,
            reconciliation_reference: reconciliationReference.trim() || undefined,
          },
        });
      }

      if (pendingAction === "approve-withdrawal") {
        if (!selectedWithdrawalId) {
          return;
        }

        await approveWithdrawalMutation.mutateAsync(selectedWithdrawalId);
      }

      if (pendingAction === "reject-withdrawal") {
        if (!selectedWithdrawalId) {
          return;
        }

        await rejectWithdrawalMutation.mutateAsync({
          withdrawalId: selectedWithdrawalId,
          body: { reason: trimmedReason },
        });
      }

      if (pendingAction === "complete-withdrawal") {
        if (!selectedWithdrawalId) {
          return;
        }

        const trimmedTransferReference = bankTransferReference.trim();

        if (!trimmedTransferReference) {
          setActionError({
            kind: "validation_error",
            status: 400,
            message: "Bank transfer reference is required to complete a withdrawal.",
            code: "validation_error",
            fieldErrors: [],
          });
          return;
        }

        await completeWithdrawalMutation.mutateAsync({
          withdrawalId: selectedWithdrawalId,
          body: {
            bank_transfer_reference: trimmedTransferReference,
            reconciliation_reference: reconciliationReference.trim() || undefined,
          },
        });
      }

      setPendingAction(null);
      setReason("");
      setSubmitState("submitted");
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  }

  return {
    filters,
    lookupDepositId,
    lookupWithdrawalId,
    selectedDepositId,
    selectedWithdrawalId,
    selectedDeposit,
    selectedWithdrawal,
    deposits,
    withdrawals,
    isLoadingDeposits,
    isLoadingWithdrawals,
    reviewCasesQuery,
    actionError,
    pendingAction,
    reason,
    bankReference,
    reconciliationReference,
    bankTransferReference,
    submitState,
    isSubmitting,
    setLookupDepositId,
    setLookupWithdrawalId,
    setFilters,
    resetFilters,
    addDepositToWatchList,
    addWithdrawalToWatchList,
    selectDeposit: (depositId: string) => updateSearchParams({ selectedDeposit: depositId }),
    selectWithdrawal: (withdrawalId: string) =>
      updateSearchParams({ selectedWithdrawal: withdrawalId }),
    openActionModal,
    closeActionModal,
    setReason,
    setBankReference,
    setReconciliationReference,
    setBankTransferReference,
    confirmAction,
    refresh: () => {
      void reviewCasesQuery.refetch();
      depositQueries.forEach((query) => {
        void query.refetch();
      });
      withdrawalQueries.forEach((query) => {
        void query.refetch();
      });
    },
  };
}
