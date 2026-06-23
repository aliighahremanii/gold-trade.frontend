/**
 * Temporary compliance response parsing.
 *
 * The frozen compliance OpenAPI contract does not declare JSON response schemas for
 * `/compliance/review-cases` list/detail or request bodies for approve/reject. Generated
 * types therefore expose `content?: never` and incomplete path parameters, which forces
 * runtime parsing into frontend-only `ReviewCaseView` types and `as never` path casts in
 * `use-review-cases.ts`.
 *
 * Replace this parser with generated DTOs once the backend publishes complete review-case
 * schemas in `contracts/openapi/compliance.openapi.json`.
 */
import type { ReviewCaseView } from "@/modules/compliance/types/review-case-view";

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function mapReviewCaseRecord(value: unknown): ReviewCaseView | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = readString(record.id);

  if (!id) {
    return null;
  }

  return {
    id,
    status: readString(record.status) ?? "unknown",
    operationType: readString(record.operation_type) ?? readString(record.operationType),
    businessReference:
      readString(record.business_reference) ?? readString(record.businessReference),
    userId: readString(record.user_id) ?? readString(record.userId),
    reason: readString(record.reason),
    failureReason: readString(record.failure_reason) ?? readString(record.failureReason),
    createdAt: readString(record.created_at) ?? readString(record.createdAt),
    updatedAt: readString(record.updated_at) ?? readString(record.updatedAt),
  };
}

export function parseReviewCaseList(payload: unknown): ReviewCaseView[] {
  const items = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && Array.isArray((payload as { items?: unknown }).items)
      ? (payload as { items: unknown[] }).items
      : [];

  return items
    .map((item) => mapReviewCaseRecord(item))
    .filter((item): item is ReviewCaseView => item !== null);
}

export function parseReviewCaseDetail(payload: unknown): ReviewCaseView | null {
  return mapReviewCaseRecord(payload);
}

export function isPendingReviewCase(status: string): boolean {
  const normalized = status.trim().toLowerCase();

  return (
    normalized === "pending" ||
    normalized === "open" ||
    normalized === "manual_review" ||
    normalized === "manual_review_required" ||
    normalized === "awaiting_review"
  );
}

export function extractOrderIdFromReviewCase(reviewCase: ReviewCaseView): string | null {
  if (!reviewCase.businessReference) {
    return null;
  }

  const operationType = reviewCase.operationType?.toLowerCase() ?? "";

  if (operationType.includes("order") || operationType.includes("trade")) {
    return reviewCase.businessReference;
  }

  return null;
}
