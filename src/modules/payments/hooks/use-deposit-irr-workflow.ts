"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDeposit, useRequestDeposit } from "@/modules/payments/api/use-deposits";
import { toNormalizedApiError } from "@/modules/payments/components/payment-error-alert";
import { mapDepositDetailToStatusView } from "@/modules/payments/mappers/map-deposit-detail";
import { resolveDepositDisplayPhase } from "@/modules/payments/utils/deposit-workflow-phase";
import { isValidIrrAmountInput, parseIrrAmountInput } from "@/modules/payments/utils/format-irr-amount";
import { walletQueryKeys } from "@/modules/wallet/api/query-keys";
import { createIdempotencyKey } from "@/shared/utils/idempotency";
import {
  clearFieldError,
  type WorkflowFieldErrors,
} from "@/shared/forms/workflow-field-errors";

type UseDepositIrrWorkflowOptions = {
  initialDepositId?: string | null;
};

export function useDepositIrrWorkflow({ initialDepositId = null }: UseDepositIrrWorkflowOptions = {}) {
  const queryClient = useQueryClient();
  const idempotencyKeyRef = useRef<string | null>(null);
  const walletInvalidatedRef = useRef(false);

  const [amountInput, setAmountInputState] = useState("");
  const [depositId, setDepositId] = useState<string | null>(initialDepositId);
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [fieldErrors, setFieldErrors] = useState<WorkflowFieldErrors>({});

  const setAmountInput = useCallback((value: string) => {
    setAmountInputState(value);
    setFieldErrors((current) => clearFieldError(current, "amount"));
  }, []);

  const requestDepositMutation = useRequestDeposit();
  const depositQuery = useDeposit(depositId, Boolean(depositId));

  const depositView = useMemo(
    () => (depositQuery.data ? mapDepositDetailToStatusView(depositQuery.data) : null),
    [depositQuery.data],
  );

  const displayPhase = useMemo(
    () =>
      resolveDepositDisplayPhase({
        isCreating: requestDepositMutation.isPending,
        depositId,
        depositStatus: depositQuery.data?.status,
        isQueryError: depositQuery.isError,
        hasDepositData: Boolean(depositQuery.data),
      }),
    [
      depositId,
      depositQuery.data,
      depositQuery.isError,
      requestDepositMutation.isPending,
    ],
  );

  useEffect(() => {
    if (displayPhase === "completed" && !walletInvalidatedRef.current) {
      walletInvalidatedRef.current = true;
      void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
    }

    if (displayPhase === "idle") {
      walletInvalidatedRef.current = false;
    }
  }, [displayPhase, queryClient]);

  const startDeposit = async () => {
    if (!isValidIrrAmountInput(amountInput)) {
      setFieldErrors({ amount: "Enter a valid IRR amount in whole rials." });
      setActionError(null);
      return;
    }

    setFieldErrors({});
    setActionError(null);

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = createIdempotencyKey();
    }

    try {
      const deposit = await requestDepositMutation.mutateAsync({
        amount: parseIrrAmountInput(amountInput),
        idempotency_key: idempotencyKeyRef.current,
      });

      setDepositId(deposit.id);
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  };

  const resetWorkflow = () => {
    setAmountInputState("");
    setDepositId(null);
    setActionError(null);
    setFieldErrors({});
    idempotencyKeyRef.current = null;
    requestDepositMutation.reset();
  };

  return {
    amountInput,
    setAmountInput,
    fieldErrors,
    depositView,
    depositId,
    actionError,
    displayPhase,
    isPolling: depositQuery.isFetching && displayPhase === "tracking",
    isSubmitting: requestDepositMutation.isPending,
    startDeposit,
    resetWorkflow,
  };
}
