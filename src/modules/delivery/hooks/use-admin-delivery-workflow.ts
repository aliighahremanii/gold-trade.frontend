"use client";

import { useQueries } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  useApproveDeliveryRequest,
  useCompleteDeliveryRequest,
  useRejectDeliveryRequest,
  useScheduleDeliveryRequest,
} from "@/modules/admin/api/use-admin-delivery";
import { useReviewCases } from "@/modules/compliance/api/use-review-cases";
import { extractDeliveryRequestIdFromReviewCase } from "@/modules/compliance/utils/parse-review-case-response";
import { getDeliveryRequest } from "@/modules/delivery/api/use-delivery-requests";
import { deliveryQueryKeys } from "@/modules/delivery/api/query-keys";
import { mapDeliveryRequestToAdminView } from "@/modules/delivery/mappers/map-delivery-request-admin-view";
import { toNormalizedApiError } from "@/shared/errors";
import {
  EMPTY_ADMIN_RECORD_FILTERS,
  matchesAdminRecordFilters,
  parseCommaSeparatedIds,
  type AdminRecordFilterState,
} from "@/shared/utils/admin-record-filters";

type DeliveryModalAction =
  | "approve"
  | "reject"
  | "schedule"
  | "complete"
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

export function useAdminDeliveryWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [lookupRequestId, setLookupRequestId] = useState("");
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [pendingAction, setPendingAction] = useState<DeliveryModalAction>(null);
  const [reason, setReason] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [handoverReference, setHandoverReference] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitted">("idle");

  const selectedRequestId = searchParams.get("selected");
  const watchRequestIds = parseCommaSeparatedIds(searchParams.get("watch"));
  const filters = readFilters(searchParams);

  const reviewCasesQuery = useReviewCases();
  const approveMutation = useApproveDeliveryRequest();
  const rejectMutation = useRejectDeliveryRequest();
  const scheduleMutation = useScheduleDeliveryRequest();
  const completeMutation = useCompleteDeliveryRequest();

  const queueRequestIds = useMemo(() => {
    const fromReviewCases = (reviewCasesQuery.data ?? [])
      .map((reviewCase) => extractDeliveryRequestIdFromReviewCase(reviewCase))
      .filter((requestId): requestId is string => Boolean(requestId));

    return [...new Set([...watchRequestIds, ...fromReviewCases])];
  }, [reviewCasesQuery.data, watchRequestIds]);

  const requestQueries = useQueries({
    queries: queueRequestIds.map((requestId) => ({
      queryKey: deliveryQueryKeys.request(requestId),
      queryFn: () => getDeliveryRequest(requestId),
      enabled: Boolean(requestId),
    })),
  });

  const requests = useMemo(
    () =>
      requestQueries
        .map((query) => (query.data ? mapDeliveryRequestToAdminView(query.data) : null))
        .filter((request): request is NonNullable<typeof request> => request !== null)
        .filter((request) =>
          matchesAdminRecordFilters(
            {
              status: request.status,
              userId: request.userId,
              updatedAt: request.updatedAt,
              createdAt: request.createdAt,
              references: [
                request.id,
                request.handoverReference,
                request.settlementId,
                request.recipientPhone,
                request.recipientName,
              ],
            },
            filters,
          ),
        ),
    [requestQueries, filters],
  );

  const selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? null;
  const isLoadingRequests =
    reviewCasesQuery.isLoading || requestQueries.some((query) => query.isLoading);

  const isSubmitting =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    scheduleMutation.isPending ||
    completeMutation.isPending;

  function updateSearchParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`/admin/delivery?${params.toString()}`);
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

  function addRequestToWatchList(requestId: string) {
    const trimmed = requestId.trim();

    if (!trimmed) {
      return;
    }

    const nextWatch = [...new Set([...watchRequestIds, trimmed])];
    updateSearchParams({ watch: nextWatch.join(","), selected: trimmed });
    setLookupRequestId("");
  }

  function openActionModal(action: Exclude<DeliveryModalAction, null>) {
    setActionError(null);
    setReason("");
    setScheduledAt("");
    setHandoverReference("");
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
        message: "A reason is required before submitting an admin delivery action.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    if (!selectedRequestId) {
      return;
    }

    setActionError(null);

    try {
      if (pendingAction === "approve") {
        await approveMutation.mutateAsync(selectedRequestId);
      }

      if (pendingAction === "reject") {
        await rejectMutation.mutateAsync({
          requestId: selectedRequestId,
          body: { reason: trimmedReason },
        });
      }

      if (pendingAction === "schedule") {
        if (!scheduledAt.trim()) {
          setActionError({
            kind: "validation_error",
            status: 400,
            message: "Scheduled date and time are required.",
            code: "validation_error",
            fieldErrors: [],
          });
          return;
        }

        await scheduleMutation.mutateAsync({
          requestId: selectedRequestId,
          body: { scheduled_at: new Date(scheduledAt).toISOString() },
        });
      }

      if (pendingAction === "complete") {
        await completeMutation.mutateAsync({
          requestId: selectedRequestId,
          body: {
            handover_reference: handoverReference.trim() || undefined,
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
    lookupRequestId,
    selectedRequestId,
    selectedRequest,
    requests,
    isLoadingRequests,
    reviewCasesQuery,
    actionError,
    pendingAction,
    reason,
    scheduledAt,
    handoverReference,
    submitState,
    isSubmitting,
    setLookupRequestId,
    setFilters,
    resetFilters,
    addRequestToWatchList,
    selectRequest: (requestId: string) => updateSearchParams({ selected: requestId }),
    openActionModal,
    closeActionModal,
    setReason,
    setScheduledAt,
    setHandoverReference,
    confirmAction,
    refresh: () => {
      void reviewCasesQuery.refetch();
      requestQueries.forEach((query) => {
        void query.refetch();
      });
    },
  };
}
