"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  useAssignReconciliationMismatch,
  useReconciliationMismatch,
  useReconciliationMismatches,
  useReconciliationRun,
  useReconciliationRuns,
  useResolveReconciliationMismatch,
  useStartDeliveryReconciliation,
  useStartPaymentReconciliation,
  useStartProviderExecutionReconciliation,
  useStartWalletLedgerReconciliation,
} from "@/modules/reconciliation/api/use-reconciliation";
import { parseAmount } from "@/modules/reconciliation/components/reconciliation-run-starter-panel";
import {
  mapReconciliationMismatchToView,
  mapReconciliationRunToView,
} from "@/modules/reconciliation/mappers/map-reconciliation-views";
import { toNormalizedApiError } from "@/shared/errors";
import {
  EMPTY_ADMIN_RECORD_FILTERS,
  matchesAdminRecordFilters,
  type AdminRecordFilterState,
} from "@/shared/utils/admin-record-filters";

type ReconciliationModalAction = "assign" | "resolve" | null;

function readFilters(searchParams: URLSearchParams): AdminRecordFilterState {
  return {
    status: searchParams.get("status") ?? "",
    userId: searchParams.get("user") ?? "",
    reference: searchParams.get("reference") ?? "",
    fromDate: searchParams.get("from") ?? "",
    toDate: searchParams.get("to") ?? "",
  };
}

function createCorrelationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `recon-${Date.now()}`;
}

export function useAdminReconciliationWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [pendingAction, setPendingAction] = useState<ReconciliationModalAction>(null);
  const [assignee, setAssignee] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [dismissMismatch, setDismissMismatch] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitted">("idle");

  const selectedRunId = searchParams.get("selectedRun");
  const selectedMismatchId = searchParams.get("selectedMismatch");
  const filters = readFilters(searchParams);

  const runsQuery = useReconciliationRuns();
  const mismatchesQuery = useReconciliationMismatches();
  const selectedRunQuery = useReconciliationRun(selectedRunId);
  const selectedMismatchQuery = useReconciliationMismatch(selectedMismatchId);

  const walletLedgerMutation = useStartWalletLedgerReconciliation();
  const providerExecutionMutation = useStartProviderExecutionReconciliation();
  const paymentMutation = useStartPaymentReconciliation();
  const deliveryMutation = useStartDeliveryReconciliation();
  const assignMutation = useAssignReconciliationMismatch();
  const resolveMutation = useResolveReconciliationMismatch();

  const runs = useMemo(
    () =>
      (runsQuery.data ?? [])
        .map((run) => mapReconciliationRunToView(run))
        .filter((run) =>
          matchesAdminRecordFilters(
            {
              status: run.status,
              userId: run.scopeUserId,
              updatedAt: run.updatedAt,
              createdAt: run.createdAt,
              references: run.references,
            },
            filters,
          ),
        ),
    [runsQuery.data, filters],
  );

  const mismatches = useMemo(
    () =>
      (mismatchesQuery.data ?? [])
        .map((mismatch) => mapReconciliationMismatchToView(mismatch))
        .filter((mismatch) =>
          matchesAdminRecordFilters(
            {
              status: mismatch.status,
              updatedAt: mismatch.updatedAt,
              createdAt: mismatch.createdAt,
              references: mismatch.references,
            },
            filters,
          ),
        ),
    [mismatchesQuery.data, filters],
  );

  const selectedRun = useMemo(() => {
    if (selectedRunQuery.data) {
      return mapReconciliationRunToView(selectedRunQuery.data);
    }

    return runs.find((run) => run.id === selectedRunId) ?? null;
  }, [selectedRunQuery.data, runs, selectedRunId]);

  const selectedMismatch = useMemo(() => {
    if (selectedMismatchQuery.data) {
      return mapReconciliationMismatchToView(selectedMismatchQuery.data);
    }

    return mismatches.find((mismatch) => mismatch.id === selectedMismatchId) ?? null;
  }, [selectedMismatchQuery.data, mismatches, selectedMismatchId]);

  const isStartingRun =
    walletLedgerMutation.isPending ||
    providerExecutionMutation.isPending ||
    paymentMutation.isPending ||
    deliveryMutation.isPending;

  const isSubmitting =
    isStartingRun || assignMutation.isPending || resolveMutation.isPending;

  function updateSearchParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`/admin/reconciliation?${params.toString()}`);
  }

  function selectRun(runId: string) {
    updateSearchParams({ selectedRun: runId });
  }

  function selectMismatch(mismatchId: string) {
    updateSearchParams({ selectedMismatch: mismatchId });
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

  async function handleStartRun<T>(action: () => Promise<T>) {
    setActionError(null);

    try {
      const run = await action();
      setSubmitState("submitted");

      if (typeof run === "object" && run !== null && "id" in run && typeof run.id === "string") {
        updateSearchParams({ selectedRun: run.id });
      }
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  }

  function openActionModal(action: ReconciliationModalAction) {
    setActionError(null);
    setAssignee("");
    setResolutionNotes("");
    setDismissMismatch(false);
    setPendingAction(action);
  }

  async function confirmAction() {
    if (!selectedMismatchId || !pendingAction) {
      return;
    }

    setActionError(null);

    try {
      if (pendingAction === "assign") {
        const trimmedAssignee = assignee.trim();

        if (!trimmedAssignee) {
          setActionError({
            kind: "validation_error",
            status: 400,
            message: "An assignee is required before assigning a mismatch.",
            code: "validation_error",
            fieldErrors: [],
          });
          return;
        }

        await assignMutation.mutateAsync({
          mismatchId: selectedMismatchId,
          body: { assigned_to: trimmedAssignee },
        });
      }

      if (pendingAction === "resolve") {
        const trimmedNotes = resolutionNotes.trim();

        if (!trimmedNotes) {
          setActionError({
            kind: "validation_error",
            status: 400,
            message: "Resolution notes are required before resolving a mismatch.",
            code: "validation_error",
            fieldErrors: [],
          });
          return;
        }

        await resolveMutation.mutateAsync({
          mismatchId: selectedMismatchId,
          body: {
            resolution_notes: trimmedNotes,
            dismiss: dismissMismatch || undefined,
          },
        });
      }

      setPendingAction(null);
      setSubmitState("submitted");
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  }

  return {
    runs,
    mismatches,
    selectedRunId,
    selectedMismatchId,
    selectedRun,
    selectedMismatch,
    runsQuery,
    mismatchesQuery,
    selectedRunQuery,
    selectedMismatchQuery,
    filters,
    actionError,
    pendingAction,
    assignee,
    resolutionNotes,
    dismissMismatch,
    submitState,
    isSubmitting,
    setAssignee,
    setResolutionNotes,
    setDismissMismatch,
    selectRun,
    selectMismatch,
    setFilters,
    resetFilters,
    openActionModal,
    closeActionModal: () => {
      if (!isSubmitting) {
        setPendingAction(null);
      }
    },
    confirmAction,
    startWalletLedger: (input: { userId: string; assetCode: string }) =>
      handleStartRun(() =>
        walletLedgerMutation.mutateAsync({
          user_id: input.userId.trim(),
          asset_code: input.assetCode.trim(),
          correlation_id: createCorrelationId(),
        }),
      ),
    startProviderExecution: (input: {
      executionId: string;
      orderId: string;
      providerCode: string;
      marketSymbol: string;
      baseAmount: string;
      side: string;
    }) =>
      handleStartRun(() =>
        providerExecutionMutation.mutateAsync({
          execution_id: input.executionId.trim(),
          internal_order_id: input.orderId.trim(),
          provider_code: input.providerCode.trim(),
          internal_market_symbol: input.marketSymbol.trim(),
          internal_base_amount: parseAmount(input.baseAmount),
          internal_side: input.side.trim(),
          correlation_id: createCorrelationId(),
        }),
      ),
    startPayment: (input: {
      paymentType: string;
      internalId: string;
      userId: string;
      internalAmount: string;
      externalAmount: string;
      externalBankReference: string;
      internalStatus: string;
    }) =>
      handleStartRun(() =>
        paymentMutation.mutateAsync({
          payment_type: input.paymentType.trim(),
          internal_id: input.internalId.trim(),
          user_id: input.userId.trim(),
          internal_amount: parseAmount(input.internalAmount),
          external_amount: parseAmount(input.externalAmount),
          external_bank_reference: input.externalBankReference.trim(),
          internal_status: input.internalStatus.trim(),
          correlation_id: createCorrelationId(),
        }),
      ),
    startDelivery: (input: {
      requestId: string;
      userId: string;
      internalAssetCode: string;
      internalAmount: string;
      externalAmount: string;
      externalCustodyReference: string;
      internalStatus: string;
    }) =>
      handleStartRun(() =>
        deliveryMutation.mutateAsync({
          request_id: input.requestId.trim(),
          user_id: input.userId.trim(),
          internal_asset_code: input.internalAssetCode.trim(),
          internal_amount: parseAmount(input.internalAmount),
          external_amount: parseAmount(input.externalAmount),
          external_custody_reference: input.externalCustodyReference.trim(),
          internal_status: input.internalStatus.trim(),
          correlation_id: createCorrelationId(),
        }),
      ),
    refresh: () => {
      void runsQuery.refetch();
      void mismatchesQuery.refetch();

      if (selectedRunId) {
        void selectedRunQuery.refetch();
      }

      if (selectedMismatchId) {
        void selectedMismatchQuery.refetch();
      }
    },
  };
}

export { EMPTY_ADMIN_RECORD_FILTERS };
