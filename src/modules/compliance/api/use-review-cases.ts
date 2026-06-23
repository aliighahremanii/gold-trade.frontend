import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { normalizeApiError } from "@/shared/errors";

import { complianceClient } from "./client";
import { complianceQueryKeys } from "./query-keys";
import {
  parseReviewCaseDetail,
  parseReviewCaseList,
} from "@/modules/compliance/utils/parse-review-case-response";
import type { ReviewCaseView } from "@/modules/compliance/types/review-case-view";

/**
 * Compliance review-case hooks use manual JSON parsing because the generated compliance
 * schema omits response bodies and path parameter types for review-case routes.
 * See `parse-review-case-response.ts` for the contract gap and removal criteria.
 */
async function readJsonBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function listReviewCases(): Promise<ReviewCaseView[]> {
  const result = await complianceClient.GET("/compliance/review-cases");

  if (!result.response.ok) {
    throw normalizeApiError({
      status: result.response.status,
      body: result.error,
      fallbackMessage: "Unable to load manual review cases.",
    });
  }

  const payload = result.data ?? (await readJsonBody(result.response));
  return parseReviewCaseList(payload);
}

async function getReviewCase(caseId: string): Promise<ReviewCaseView> {
  const result = await complianceClient.GET("/compliance/review-cases/{id}", {
    params: { path: { id: caseId } },
  } as never);

  if (!result.response.ok) {
    throw normalizeApiError({
      status: result.response.status,
      body: result.error,
      fallbackMessage: "Unable to load the review case.",
    });
  }

  const payload = result.data ?? (await readJsonBody(result.response));
  const reviewCase = parseReviewCaseDetail(payload);

  if (!reviewCase) {
    throw normalizeApiError({
      status: result.response.status,
      fallbackMessage: "Review case response was not recognized.",
    });
  }

  return reviewCase;
}

async function approveReviewCase(caseId: string): Promise<void> {
  const result = await complianceClient.POST("/compliance/review-cases/{id}/approve", {
    params: { path: { id: caseId } },
  } as never);

  if (!result.response.ok) {
    throw normalizeApiError({
      status: result.response.status,
      body: result.error,
      fallbackMessage: "Unable to approve the review case.",
    });
  }
}

async function rejectReviewCase(caseId: string): Promise<void> {
  const result = await complianceClient.POST("/compliance/review-cases/{id}/reject", {
    params: { path: { id: caseId } },
  } as never);

  if (!result.response.ok) {
    throw normalizeApiError({
      status: result.response.status,
      body: result.error,
      fallbackMessage: "Unable to reject the review case.",
    });
  }
}

export function useReviewCases(enabled = true) {
  return useQuery({
    queryKey: complianceQueryKeys.reviewCases(),
    queryFn: listReviewCases,
    enabled,
  });
}

export function useReviewCase(caseId: string | null, enabled = true) {
  return useQuery({
    queryKey: complianceQueryKeys.reviewCase(caseId ?? "unknown"),
    queryFn: () => getReviewCase(caseId as string),
    enabled: Boolean(caseId) && enabled,
  });
}

export function useApproveReviewCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveReviewCase,
    onSuccess: async (_data, caseId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: complianceQueryKeys.reviewCases() }),
        queryClient.invalidateQueries({ queryKey: complianceQueryKeys.reviewCase(caseId) }),
      ]);
    },
  });
}

export function useRejectReviewCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectReviewCase,
    onSuccess: async (_data, caseId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: complianceQueryKeys.reviewCases() }),
        queryClient.invalidateQueries({ queryKey: complianceQueryKeys.reviewCase(caseId) }),
      ]);
    },
  });
}
