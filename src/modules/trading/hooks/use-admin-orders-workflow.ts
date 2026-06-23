"use client";

import { useQueries } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useApproveOrder } from "@/modules/admin/api/use-admin-orders";
import { toNormalizedApiError } from "@/shared/errors";
import { useReviewCases } from "@/modules/compliance/api/use-review-cases";
import { extractOrderIdFromReviewCase } from "@/modules/compliance/utils/parse-review-case-response";
import { getOrder } from "@/modules/trading/api/use-orders";
import { tradingQueryKeys } from "@/modules/trading/api/query-keys";
import { mapOrderDetailToAdminView } from "@/modules/trading/mappers/map-order-detail";

function parseWatchList(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

export function useAdminOrdersWorkflow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lookupOrderId, setLookupOrderId] = useState("");
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitted">("idle");

  const selectedOrderId = searchParams.get("selected");
  const watchOrderIds = parseWatchList(searchParams.get("watch"));

  const reviewCasesQuery = useReviewCases();
  const approveOrderMutation = useApproveOrder();

  const queueOrderIds = useMemo(() => {
    const fromReviewCases = (reviewCasesQuery.data ?? [])
      .map((reviewCase) => extractOrderIdFromReviewCase(reviewCase))
      .filter((orderId): orderId is string => Boolean(orderId));

    return [...new Set([...watchOrderIds, ...fromReviewCases])];
  }, [reviewCasesQuery.data, watchOrderIds]);

  const orderQueries = useQueries({
    queries: queueOrderIds.map((orderId) => ({
      queryKey: tradingQueryKeys.order(orderId),
      queryFn: () => getOrder(orderId),
      enabled: Boolean(orderId),
    })),
  });

  const orders = useMemo(
    () =>
      orderQueries
        .map((query) => (query.data ? mapOrderDetailToAdminView(query.data) : null))
        .filter((order): order is NonNullable<typeof order> => order !== null),
    [orderQueries],
  );

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;
  const isLoadingOrders = reviewCasesQuery.isLoading || orderQueries.some((query) => query.isLoading);

  function updateSearchParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`/admin/orders?${params.toString()}`);
  }

  function addOrderToWatchList(orderId: string) {
    const trimmed = orderId.trim();

    if (!trimmed) {
      return;
    }

    const nextWatch = [...new Set([...watchOrderIds, trimmed])];
    updateSearchParams({ watch: nextWatch.join(","), selected: trimmed });
    setLookupOrderId("");
  }

  function selectOrder(orderId: string) {
    updateSearchParams({ selected: orderId });
  }

  function openApproveModal() {
    setActionError(null);
    setApprovalReason("");
    setIsApproveModalOpen(true);
  }

  async function confirmApprove() {
    if (!selectedOrderId) {
      return;
    }

    const trimmedReason = approvalReason.trim();

    if (!trimmedReason) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "A reason is required before approving an order.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    setActionError(null);

    try {
      await approveOrderMutation.mutateAsync(selectedOrderId);
      setIsApproveModalOpen(false);
      setApprovalReason("");
      setSubmitState("submitted");
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  }

  return {
    lookupOrderId,
    selectedOrderId,
    selectedOrder,
    orders,
    queueOrderIds,
    isLoadingOrders,
    reviewCasesQuery,
    actionError,
    isApproveModalOpen,
    approvalReason,
    submitState,
    isApproving: approveOrderMutation.isPending,
    setLookupOrderId,
    addOrderToWatchList,
    selectOrder,
    openApproveModal,
    setApprovalReason,
    closeApproveModal: () => {
      if (!approveOrderMutation.isPending) {
        setIsApproveModalOpen(false);
      }
    },
    confirmApprove,
    refresh: () => {
      void reviewCasesQuery.refetch();
      orderQueries.forEach((query) => {
        void query.refetch();
      });
    },
  };
}
