"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  useConfirmQuote,
  useCreateQuote,
  useQuote,
  useQuoteConfirmationEligibility,
} from "@/modules/quote/api/use-quotes";
import { useCreateOrder, useOrder } from "@/modules/trading/api/use-orders";
import { toNormalizedApiError } from "@/modules/trading/components/trade-error-alert";
import { mapQuoteDetailToSummary } from "@/modules/trading/mappers/map-quote-summary";
import type { TradeWorkflowPhase } from "@/modules/trading/types/trade-workflow";
import { createIdempotencyKey } from "@/modules/trading/utils/idempotency";
import {
  isManualReviewOrderStatus,
  isSettlementFailedOrderStatus,
  isSuccessfulOrderStatus,
  isTerminalOrderStatus,
} from "@/modules/trading/utils/order-status";
import { isQuoteExpired } from "@/modules/trading/utils/quote-expiry";
import {
  gramsInputToDisplayAmount,
  isValidGramsInput,
  TRADE_DISPLAY_UNIT,
  type TradeSide,
  XAU_IRR_MARKET_SYMBOL,
} from "@/modules/trading/utils/trade-market";
import { walletQueryKeys } from "@/modules/wallet/api/query-keys";

type UseTradeGoldWorkflowOptions = {
  side: TradeSide;
};

export function useTradeGoldWorkflow({ side }: UseTradeGoldWorkflowOptions) {
  const queryClient = useQueryClient();
  const idempotencyKeyRef = useRef<string | null>(null);

  const [phase, setPhase] = useState<TradeWorkflowPhase>("idle");
  const [amountInput, setAmountInput] = useState("");
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);

  const createQuoteMutation = useCreateQuote();
  const confirmQuoteMutation = useConfirmQuote();
  const createOrderMutation = useCreateOrder();

  const quoteQuery = useQuote(quoteId, Boolean(quoteId));
  const eligibilityQuery = useQuoteConfirmationEligibility(quoteId, isConfirmModalOpen && Boolean(quoteId));
  const orderQuery = useOrder(orderId, Boolean(orderId));

  const quoteSummary = useMemo(
    () => (quoteQuery.data ? mapQuoteDetailToSummary(quoteQuery.data) : null),
    [quoteQuery.data],
  );

  const displayPhase = useMemo<TradeWorkflowPhase>(() => {
    if (phase === "quote_ready" && quoteQuery.data && isQuoteExpired(quoteQuery.data.expires_at)) {
      return "quote_expired";
    }

    if (phase === "order_tracking" && orderQuery.data) {
      if (isSuccessfulOrderStatus(orderQuery.data.status)) {
        return "completed";
      }

      if (isSettlementFailedOrderStatus(orderQuery.data.status) || orderQuery.data.status.toLowerCase() === "failed") {
        return "failed";
      }

      if (isManualReviewOrderStatus(orderQuery.data.status)) {
        return "manual_review_required";
      }

      if (isTerminalOrderStatus(orderQuery.data.status)) {
        return "unknown";
      }
    }

    return phase;
  }, [orderQuery.data, phase, quoteQuery.data]);

  const invalidateWallet = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
  }, [queryClient]);

  const walletInvalidatedRef = useRef(false);

  useEffect(() => {
    if (displayPhase === "completed" && !walletInvalidatedRef.current) {
      walletInvalidatedRef.current = true;
      void invalidateWallet();
    }

    if (displayPhase === "idle") {
      walletInvalidatedRef.current = false;
    }
  }, [displayPhase, invalidateWallet]);

  const resetWorkflow = useCallback(() => {
    setPhase("idle");
    setAmountInput("");
    setQuoteId(null);
    setOrderId(null);
    setIsConfirmModalOpen(false);
    setActionError(null);
    idempotencyKeyRef.current = null;
    createQuoteMutation.reset();
    confirmQuoteMutation.reset();
    createOrderMutation.reset();
  }, [confirmQuoteMutation, createOrderMutation, createQuoteMutation]);

  const requestQuote = useCallback(async () => {
    if (!isValidGramsInput(amountInput)) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "Enter a valid gold amount greater than zero.",
        fieldErrors: [],
      });
      return;
    }

    setActionError(null);
    setPhase("quote_loading");

    try {
      const quote = await createQuoteMutation.mutateAsync({
        market_symbol: XAU_IRR_MARKET_SYMBOL,
        side,
        display_unit: TRADE_DISPLAY_UNIT,
        display_amount: gramsInputToDisplayAmount(amountInput),
      });

      setQuoteId(quote.id);
      setPhase(isQuoteExpired(quote.expires_at) ? "quote_expired" : "quote_ready");
    } catch (error) {
      setPhase("idle");
      setActionError(toNormalizedApiError(error));
    }
  }, [amountInput, createQuoteMutation, side]);

  const openConfirmationModal = useCallback(() => {
    if (!quoteQuery.data || isQuoteExpired(quoteQuery.data.expires_at)) {
      setPhase("quote_expired");
      setActionError({
        kind: "quote_expired",
        status: 409,
        message: "This quote has expired. Request a new quote to continue.",
        fieldErrors: [],
      });
      return;
    }

    setActionError(null);
    setIsConfirmModalOpen(true);
  }, [quoteQuery.data]);

  const closeConfirmationModal = useCallback(() => {
    if (confirmQuoteMutation.isPending || createOrderMutation.isPending) {
      return;
    }

    setIsConfirmModalOpen(false);
    setPhase(quoteId ? "quote_ready" : "idle");
  }, [confirmQuoteMutation.isPending, createOrderMutation.isPending, quoteId]);

  const confirmTrade = useCallback(async () => {
    if (!quoteId || !quoteQuery.data) {
      return;
    }

    if (isQuoteExpired(quoteQuery.data.expires_at)) {
      setPhase("quote_expired");
      setIsConfirmModalOpen(false);
      setActionError({
        kind: "quote_expired",
        status: 409,
        message: "This quote has expired. Request a new quote to continue.",
        fieldErrors: [],
      });
      return;
    }

    setPhase("confirming");
    setActionError(null);

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = createIdempotencyKey();
    }

    try {
      const eligibility = eligibilityQuery.data ?? (await eligibilityQuery.refetch()).data;

      if (!eligibility?.eligible) {
        throw {
          kind: "quote_expired",
          status: 409,
          message: eligibility?.reason ?? "This quote cannot be confirmed right now.",
          fieldErrors: [],
        };
      }

      await confirmQuoteMutation.mutateAsync(quoteId);

      const order = await createOrderMutation.mutateAsync({
        quote_id: quoteId,
        idempotency_key: idempotencyKeyRef.current,
      });

      setOrderId(order.id);
      setIsConfirmModalOpen(false);
      setPhase("order_tracking");
    } catch (error) {
      const normalized = toNormalizedApiError(error);
      setActionError(
        normalized ?? {
          kind: "unknown_error",
          status: 500,
          message: "Unable to confirm the trade.",
          fieldErrors: [],
        },
      );
      setPhase(quoteId ? "quote_ready" : "idle");
      setIsConfirmModalOpen(false);
    }
  }, [
    confirmQuoteMutation,
    createOrderMutation,
    eligibilityQuery,
    quoteId,
    quoteQuery.data,
  ]);

  const isSubmitting =
    createQuoteMutation.isPending || confirmQuoteMutation.isPending || createOrderMutation.isPending;

  return {
    phase: displayPhase,
    amountInput,
    setAmountInput,
    quoteSummary,
    quote: quoteQuery.data ?? null,
    order: orderQuery.data ?? null,
    actionError,
    isConfirmModalOpen,
    isSubmitting,
    isOrderPolling:
      orderQuery.isFetching && Boolean(orderId) && displayPhase === "order_tracking",
    requestQuote,
    openConfirmationModal,
    closeConfirmationModal,
    confirmTrade,
    resetWorkflow,
  };
}
