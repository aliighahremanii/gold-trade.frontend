"use client";

import { useMemo, useState } from "react";

import {
  useApproveReviewCase,
  useRejectReviewCase,
  useReviewCases,
} from "@/modules/compliance/api/use-review-cases";
import { isPendingReviewCase } from "@/modules/compliance/utils/parse-review-case-response";
import { toNormalizedApiError } from "@/shared/errors";

type PendingAction = "approve" | "reject" | null;

export function useAdminApprovalsWorkflow() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [reason, setReason] = useState("");
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitted">("idle");

  const reviewCasesQuery = useReviewCases();
  const approveMutation = useApproveReviewCase();
  const rejectMutation = useRejectReviewCase();

  const pendingQueue = useMemo(
    () => (reviewCasesQuery.data ?? []).filter((reviewCase) => isPendingReviewCase(reviewCase.status)),
    [reviewCasesQuery.data],
  );
  const reviewCases = reviewCasesQuery.data ?? [];
  const selectedCase =
    reviewCases.find((reviewCase) => reviewCase.id === selectedCaseId) ?? pendingQueue[0] ?? null;

  const isSubmitting = approveMutation.isPending || rejectMutation.isPending;

  function openActionModal(action: PendingAction) {
    if (!selectedCase) {
      return;
    }

    setActionError(null);
    setReason("");
    setPendingAction(action);
  }

  async function confirmAction() {
    if (!selectedCase || !pendingAction) {
      return;
    }

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "A reason is required before completing this review action.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    setActionError(null);

    try {
      if (pendingAction === "approve") {
        await approveMutation.mutateAsync(selectedCase.id);
      } else {
        await rejectMutation.mutateAsync(selectedCase.id);
      }

      setPendingAction(null);
      setReason("");
      setSubmitState("submitted");
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  }

  return {
    reviewCases,
    pendingQueue,
    selectedCase,
    selectedCaseId: selectedCase?.id ?? null,
    pendingAction,
    reason,
    actionError,
    submitState,
    isSubmitting,
    reviewCasesQuery,
    setSelectedCaseId,
    openApproveModal: () => openActionModal("approve"),
    openRejectModal: () => openActionModal("reject"),
    setReason,
    closeActionModal: () => {
      if (!isSubmitting) {
        setPendingAction(null);
      }
    },
    confirmAction,
    refresh: () => {
      void reviewCasesQuery.refetch();
    },
  };
}
