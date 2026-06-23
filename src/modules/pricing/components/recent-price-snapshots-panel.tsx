import Link from "next/link";

import type { PriceSnapshotView } from "@/modules/pricing/mappers/map-pricing-views";

type RecentPriceSnapshotsPanelProps = {
  snapshots: PriceSnapshotView[];
};

export function RecentPriceSnapshotsPanel({ snapshots }: RecentPriceSnapshotsPanelProps) {
  if (snapshots.length === 0) {
    return (
      <section
        aria-label="Recent price snapshots"
        className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
      >
        No recent price snapshots are available from the backend.
      </section>
    );
  }

  return (
    <section aria-label="Recent price snapshots" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Recent snapshots</h2>
        <Link href="/admin/audit" className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
          Open audit trail
        </Link>
      </div>

      <ul className="flex flex-col gap-3">
        {snapshots.map((snapshot) => (
          <li
            key={snapshot.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {snapshot.source} · {snapshot.buyPriceLabel} / {snapshot.sellPriceLabel}
              </p>
              <p className="text-xs text-zinc-500">{snapshot.createdAtLabel}</p>
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Effective from</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{snapshot.effectiveFromLabel}</dd>
              </div>
              {snapshot.expiresAtLabel ? (
                <div>
                  <dt className="text-zinc-500">Expires at</dt>
                  <dd className="text-zinc-900 dark:text-zinc-50">{snapshot.expiresAtLabel}</dd>
                </div>
              ) : null}
              {snapshot.reason ? (
                <div className="sm:col-span-2">
                  <dt className="text-zinc-500">Reason</dt>
                  <dd className="text-zinc-900 dark:text-zinc-50">{snapshot.reason}</dd>
                </div>
              ) : null}
              {snapshot.actorId ? (
                <div className="sm:col-span-2">
                  <dt className="text-zinc-500">Actor</dt>
                  <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{snapshot.actorId}</dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
