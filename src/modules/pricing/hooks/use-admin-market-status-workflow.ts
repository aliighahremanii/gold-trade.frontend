"use client";

import { useState } from "react";

import { useSetMarketStatus } from "@/modules/admin/api/use-admin-pricing";
import { toNormalizedApiError } from "@/modules/pricing/components/pricing-error-alert";
import {
  getPricingQueryErrorMessage,
  useInvalidateMarketPricing,
  useMarketPricingStatus,
} from "@/modules/pricing/api/use-market-pricing";
import { formatMarketStatusLabel } from "@/modules/pricing/utils/market-status";
import { XAU_IRR_MARKET_SYMBOL } from "@/modules/pricing/utils/market-symbol";

export function useAdminMarketStatusWorkflow(symbol: string = XAU_IRR_MARKET_SYMBOL) {
  const [draftStatus, setDraftStatus] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitted">("idle");

  const statusQuery = useMarketPricingStatus(symbol);
  const setMarketStatusMutation = useSetMarketStatus();
  const invalidateMarketPricing = useInvalidateMarketPricing(symbol);

  const currentStatus = statusQuery.data?.status;
  const selectedStatus = draftStatus ?? currentStatus ?? "";
  const formDisabled = statusQuery.isLoading || statusQuery.isError || setMarketStatusMutation.isPending;

  function openConfirmation() {
    setActionError(null);
    setSubmitState("idle");

    if (!selectedStatus) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "Select a market pricing status before continuing.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    if (selectedStatus === currentStatus) {
      return;
    }

    setIsConfirmModalOpen(true);
  }

  async function confirmStatusChange() {
    if (!selectedStatus) {
      return;
    }

    setActionError(null);

    try {
      await setMarketStatusMutation.mutateAsync({
        symbol,
        body: { status: selectedStatus },
      });

      setIsConfirmModalOpen(false);
      setDraftStatus(null);
      setSubmitState("submitted");
      await invalidateMarketPricing();
      await statusQuery.refetch();
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  }

  function refreshStatus() {
    void statusQuery.refetch();
  }

  return {
    symbol,
    selectedStatus,
    currentStatus,
    currentStatusLabel: currentStatus ? formatMarketStatusLabel(currentStatus) : undefined,
    targetStatusLabel: selectedStatus ? formatMarketStatusLabel(selectedStatus) : undefined,
    formDisabled,
    isConfirmModalOpen,
    actionError,
    submitState,
    statusQuery,
    statusErrorMessage: statusQuery.isError
      ? getPricingQueryErrorMessage(statusQuery.error)
      : undefined,
    setSelectedStatus: setDraftStatus,
    openConfirmation,
    closeConfirmation: () => {
      if (!setMarketStatusMutation.isPending) {
        setIsConfirmModalOpen(false);
      }
    },
    confirmStatusChange,
    refreshStatus,
    isSubmitting: setMarketStatusMutation.isPending,
  };
}
