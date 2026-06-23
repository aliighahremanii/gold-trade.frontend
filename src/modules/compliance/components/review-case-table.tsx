import Link from "next/link";

import type { ReviewCaseView } from "@/modules/compliance/types/review-case-view";
import { isPendingReviewCase } from "@/modules/compliance/utils/parse-review-case-response";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

type ReviewCaseTableProps = {
  reviewCases: ReviewCaseView[];
  selectedCaseId?: string | null;
  onSelectCase: (caseId: string) => void;
};

export function ReviewCaseTable({ reviewCases, selectedCaseId, onSelectCase }: ReviewCaseTableProps) {
  if (reviewCases.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No manual review cases are currently reported by the compliance service.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Case</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Status</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Operation</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Reference</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {reviewCases.map((reviewCase) => {
            const pending = isPendingReviewCase(reviewCase.status);
            const orderHref = reviewCase.businessReference
              ? `/admin/orders/${reviewCase.businessReference}`
              : null;

            return (
              <tr
                key={reviewCase.id}
                className={selectedCaseId === reviewCase.id ? "bg-zinc-50 dark:bg-zinc-900" : undefined}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectCase(reviewCase.id)}
                    className="font-mono text-xs text-zinc-900 underline dark:text-zinc-50"
                  >
                    {reviewCase.id}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      pending
                        ? "rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
                        : "rounded-full border border-zinc-300 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                    }
                  >
                    {reviewCase.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                  {reviewCase.operationType ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {orderHref ? (
                    <Link href={orderHref} className="font-mono text-xs underline">
                      {reviewCase.businessReference}
                    </Link>
                  ) : (
                    <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      {reviewCase.businessReference ?? "—"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {reviewCase.updatedAt ? formatTimestamp(reviewCase.updatedAt) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
