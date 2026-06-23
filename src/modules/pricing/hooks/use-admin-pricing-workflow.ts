"use client";

import { useMemo, useState } from "react";

import { useSetManualPrice } from "@/modules/admin/api/use-admin-pricing";
import { toNormalizedApiError } from "@/shared/errors";
import {
  getPricingQueryErrorMessage,
  isSelectedPriceUnavailableError,
  useInvalidateMarketPricing,
  useMarketPrices,
  usePricingPolicy,
  useSelectedPrice,
} from "@/modules/pricing/api/use-market-pricing";
import {
  formatIrrPriceAmount,
  fromDateTimeLocalValue,
  isValidPriceValidityWindow,
  parseIrrPriceInput,
} from "@/modules/pricing/utils/format-price-amount";
import { XAU_IRR_MARKET_SYMBOL } from "@/modules/pricing/utils/market-symbol";

type PendingManualPrice = {
  buyPrice: number;
  sellPrice: number;
  quotePerBaseUnit: string;
  reason: string;
  effectiveFrom?: string;
  expiresAt?: string;
};

export function useAdminPricingWorkflow(symbol: string = XAU_IRR_MARKET_SYMBOL) {
  const [buyPriceInput, setBuyPriceInput] = useState("");
  const [sellPriceInput, setSellPriceInput] = useState("");
  const [reason, setReason] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingManualPrice, setPendingManualPrice] = useState<PendingManualPrice | null>(null);
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitted">("idle");

  const selectedPriceQuery = useSelectedPrice(symbol);
  const policyQuery = usePricingPolicy(symbol);
  const snapshotsQuery = useMarketPrices(symbol);
  const setManualPriceMutation = useSetManualPrice();
  const invalidateMarketPricing = useInvalidateMarketPricing(symbol);

  const quotePerBaseUnit = policyQuery.data?.quote_per_base_unit ?? "";

  const formDisabled =
    policyQuery.isLoading || policyQuery.isError || !quotePerBaseUnit || setManualPriceMutation.isPending;

  const confirmationSummary = useMemo(() => {
    if (!pendingManualPrice) {
      return null;
    }

    return {
      buyPriceLabel: formatIrrPriceAmount(pendingManualPrice.buyPrice),
      sellPriceLabel: formatIrrPriceAmount(pendingManualPrice.sellPrice),
      quotePerBaseUnit: pendingManualPrice.quotePerBaseUnit,
      reason: pendingManualPrice.reason,
      effectiveFrom: pendingManualPrice.effectiveFrom,
      expiresAt: pendingManualPrice.expiresAt,
    };
  }, [pendingManualPrice]);

  function openConfirmation() {
    setActionError(null);
    setSubmitState("idle");

    const buyPrice = parseIrrPriceInput(buyPriceInput);
    const sellPrice = parseIrrPriceInput(sellPriceInput);
    const trimmedReason = reason.trim();

    if (!buyPrice || !sellPrice) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "Enter valid positive IRR amounts for both buy and sell prices.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    if (!trimmedReason) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "A reason is required for manual pricing changes.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    if (!quotePerBaseUnit) {
      setActionError({
        kind: "unknown_error",
        status: 500,
        message: "Pricing policy is not available yet. Refresh and try again.",
        code: "pricing_policy_unavailable",
        fieldErrors: [],
      });
      return;
    }

    const effectiveFromIso = fromDateTimeLocalValue(effectiveFrom);
    const expiresAtIso = fromDateTimeLocalValue(expiresAt);

    if (!isValidPriceValidityWindow(effectiveFromIso, expiresAtIso)) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "Expires at must be after effective from when both validity fields are provided.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    setPendingManualPrice({
      buyPrice,
      sellPrice,
      quotePerBaseUnit,
      reason: trimmedReason,
      effectiveFrom: effectiveFromIso,
      expiresAt: expiresAtIso,
    });
    setIsConfirmModalOpen(true);
  }

  async function confirmManualPrice() {
    if (!pendingManualPrice) {
      return;
    }

    setActionError(null);

    try {
      await setManualPriceMutation.mutateAsync({
        symbol,
        body: {
          buy_price: pendingManualPrice.buyPrice,
          sell_price: pendingManualPrice.sellPrice,
          quote_per_base_unit: pendingManualPrice.quotePerBaseUnit,
          reason: pendingManualPrice.reason,
          effective_from: pendingManualPrice.effectiveFrom,
          expires_at: pendingManualPrice.expiresAt,
        },
      });

      setIsConfirmModalOpen(false);
      setPendingManualPrice(null);
      setBuyPriceInput("");
      setSellPriceInput("");
      setReason("");
      setEffectiveFrom("");
      setExpiresAt("");
      setSubmitState("submitted");
      await invalidateMarketPricing();
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  }

  function refreshPricing() {
    void Promise.all([
      selectedPriceQuery.refetch(),
      policyQuery.refetch(),
      snapshotsQuery.refetch(),
    ]);
  }

  const selectedPriceUnavailable =
    selectedPriceQuery.isError && isSelectedPriceUnavailableError(selectedPriceQuery.error);

  return {
    symbol,
    buyPriceInput,
    sellPriceInput,
    reason,
    effectiveFrom,
    expiresAt,
    quotePerBaseUnit,
    formDisabled,
    isConfirmModalOpen,
    confirmationSummary,
    actionError,
    submitState,
    selectedPriceQuery,
    policyQuery,
    snapshotsQuery,
    selectedPriceUnavailable,
    selectedPriceUnavailableMessage: selectedPriceUnavailable
      ? getPricingQueryErrorMessage(selectedPriceQuery.error)
      : undefined,
    setBuyPriceInput,
    setSellPriceInput,
    setReason,
    setEffectiveFrom,
    setExpiresAt,
    openConfirmation,
    closeConfirmation: () => {
      if (!setManualPriceMutation.isPending) {
        setIsConfirmModalOpen(false);
        setPendingManualPrice(null);
      }
    },
    confirmManualPrice,
    refreshPricing,
    isSubmitting: setManualPriceMutation.isPending,
  };
}
