import Link from "next/link";

import type { ReviewCaseView } from "@/modules/compliance/types/review-case-view";
import { isPendingReviewCase } from "@/modules/compliance/utils/parse-review-case-response";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

type ReviewCaseDetailPanelProps = {
  reviewCase: ReviewCaseView;
  isSubmitting: boolean;
  onApprove: () => void;
  onReject: () => void;
};

export function ReviewCaseDetailPanel({
  reviewCase,
  isSubmitting,
  onApprove,
  onReject,
}: ReviewCaseDetailPanelProps) {
  const pending = isPendingReviewCase(reviewCase.status);

  return (
    <section
      aria-label="Review case detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Review case</h2>
        <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{reviewCase.id}</p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Status</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{reviewCase.status}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Operation</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{reviewCase.operationType ?? "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Business reference</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {reviewCase.businessReference ?? "—"}
          </dd>
        </div>
        {reviewCase.userId ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">User</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{reviewCase.userId}</dd>
          </div>
        ) : null}
        {reviewCase.reason ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Reason</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{reviewCase.reason}</dd>
          </div>
        ) : null}
        {reviewCase.failureReason ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-amber-800 dark:text-amber-200">{reviewCase.failureReason}</dd>
          </div>
        ) : null}
        {reviewCase.createdAt ? (
          <div>
            <dt className="text-zinc-500">Created</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">
              {formatTimestamp(reviewCase.createdAt)}
            </dd>
          </div>
        ) : null}
        {reviewCase.updatedAt ? (
          <div>
            <dt className="text-zinc-500">Updated</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">
              {formatTimestamp(reviewCase.updatedAt)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-wrap gap-3">
        {pending ? (
          <>
            <button
              type="button"
              onClick={onApprove}
              disabled={isSubmitting}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Review approval
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={isSubmitting}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50"
            >
              Review rejection
            </button>
          </>
        ) : null}
        {reviewCase.businessReference ? (
          <Link
            href={`/admin/orders/${reviewCase.businessReference}`}
            className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50"
          >
            Open related order
          </Link>
        ) : null}
        <Link href="/admin/audit" className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
          Audit trail
        </Link>
      </div>
    </section>
  );
}
