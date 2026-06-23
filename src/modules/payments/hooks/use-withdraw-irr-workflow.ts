"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  useCancelWithdrawal,
  useRequestWithdrawal,
  useWithdrawal,
} from "@/modules/payments/api/use-withdrawals";
import { toNormalizedApiError } from "@/modules/payments/components/payment-error-alert";
import { mapWithdrawalDetailToStatusView } from "@/modules/payments/mappers/map-withdrawal-detail";
import { isValidIrrAmountInput, parseIrrAmountInput } from "@/modules/payments/utils/format-irr-amount";
import { isSuccessfulWithdrawalStatus } from "@/modules/payments/utils/payment-status";
import {
  idempotencyKeyAfterSuccessfulMutation,
  resolveIdempotencyKey,
} from "@/modules/payments/utils/withdrawal-idempotency";
import {
  readWithdrawalSessionIds,
  rememberWithdrawalSessionId,
} from "@/modules/payments/utils/withdrawal-session";
import { walletQueryKeys } from "@/modules/wallet/api/query-keys";
import { createIdempotencyKey } from "@/shared/utils/idempotency";

export function useWithdrawIrrWorkflow() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const idempotencyKeyRef = useRef<string | null>(null);
  const walletInvalidatedRef = useRef(false);

  const [amountInput, setAmountInput] = useState("");
  const [bankAccountReference, setBankAccountReference] = useState("");
  const [sessionWithdrawalIds, setSessionWithdrawalIds] = useState<string[]>(() =>
    readWithdrawalSessionIds(),
  );
  const [latestWithdrawalId, setLatestWithdrawalId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);

  const requestWithdrawalMutation = useRequestWithdrawal();
  const latestWithdrawalQuery = useWithdrawal(latestWithdrawalId, Boolean(latestWithdrawalId));
  const cancelWithdrawalMutation = useCancelWithdrawal();

  const latestWithdrawalView = useMemo(
    () =>
      latestWithdrawalQuery.data ? mapWithdrawalDetailToStatusView(latestWithdrawalQuery.data) : null,
    [latestWithdrawalQuery.data],
  );

  const pendingWithdrawalAmount = useMemo(() => {
    try {
      return parseIrrAmountInput(amountInput);
    } catch {
      return null;
    }
  }, [amountInput]);

  useEffect(() => {
    if (
      latestWithdrawalQuery.data &&
      isSuccessfulWithdrawalStatus(latestWithdrawalQuery.data.status) &&
      !walletInvalidatedRef.current
    ) {
      walletInvalidatedRef.current = true;
      void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
    }
  }, [latestWithdrawalQuery.data, queryClient]);

  const openConfirmationModal = () => {
    if (!isValidIrrAmountInput(amountInput)) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "Enter a valid IRR amount in whole rials.",
        fieldErrors: [],
      });
      return;
    }

    if (!bankAccountReference.trim()) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "Enter the bank account reference for payout.",
        fieldErrors: [],
      });
      return;
    }

    setActionError(null);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmationModal = () => {
    if (requestWithdrawalMutation.isPending) {
      return;
    }

    setIsConfirmModalOpen(false);
  };

  const submitWithdrawal = async () => {
    if (!isValidIrrAmountInput(amountInput) || !bankAccountReference.trim()) {
      return;
    }

    setActionError(null);

    idempotencyKeyRef.current = resolveIdempotencyKey(idempotencyKeyRef.current, createIdempotencyKey);

    try {
      const withdrawal = await requestWithdrawalMutation.mutateAsync({
        amount: parseIrrAmountInput(amountInput),
        bank_account_reference: bankAccountReference.trim(),
        idempotency_key: idempotencyKeyRef.current,
      });

      setLatestWithdrawalId(withdrawal.id);
      setSessionWithdrawalIds(rememberWithdrawalSessionId(withdrawal.id));
      idempotencyKeyRef.current = idempotencyKeyAfterSuccessfulMutation();
      setIsConfirmModalOpen(false);
      router.push(`/payments/withdraw/${withdrawal.id}`);
    } catch (error) {
      setActionError(toNormalizedApiError(error));
      setIsConfirmModalOpen(false);
    }
  };

  const cancelLatestWithdrawal = async () => {
    if (!latestWithdrawalId) {
      return;
    }

    setActionError(null);

    try {
      await cancelWithdrawalMutation.mutateAsync(latestWithdrawalId);
      void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  };

  return {
    amountInput,
    setAmountInput,
    bankAccountReference,
    setBankAccountReference,
    sessionWithdrawalIds,
    latestWithdrawalView,
    actionError,
    isConfirmModalOpen,
    pendingWithdrawalAmount,
    isSubmitting: requestWithdrawalMutation.isPending,
    isPolling: latestWithdrawalQuery.isFetching && Boolean(latestWithdrawalId),
    isCancelling: cancelWithdrawalMutation.isPending,
    openConfirmationModal,
    closeConfirmationModal,
    submitWithdrawal,
    cancelLatestWithdrawal,
  };
}

export function useWithdrawIrrDetailWorkflow(withdrawalId: string) {
  const queryClient = useQueryClient();
  const walletInvalidatedRef = useRef(false);

  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const withdrawalQuery = useWithdrawal(withdrawalId, Boolean(withdrawalId));
  const cancelWithdrawalMutation = useCancelWithdrawal();

  const withdrawalView = useMemo(
    () => (withdrawalQuery.data ? mapWithdrawalDetailToStatusView(withdrawalQuery.data) : null),
    [withdrawalQuery.data],
  );

  useEffect(() => {
    if (
      withdrawalQuery.data &&
      isSuccessfulWithdrawalStatus(withdrawalQuery.data.status) &&
      !walletInvalidatedRef.current
    ) {
      walletInvalidatedRef.current = true;
      void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
    }
  }, [queryClient, withdrawalQuery.data]);

  const cancelWithdrawal = async () => {
    setActionError(null);

    try {
      await cancelWithdrawalMutation.mutateAsync(withdrawalId);
      void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  };

  return {
    withdrawalView,
    actionError,
    isLoading: withdrawalQuery.isLoading,
    isError: withdrawalQuery.isError,
    isPolling: withdrawalQuery.isFetching,
    isCancelling: cancelWithdrawalMutation.isPending,
    cancelWithdrawal,
  };
}
