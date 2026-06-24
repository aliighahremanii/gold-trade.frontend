import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminAuditRecordView } from "@/modules/audit/mappers/parse-audit-record-response";

type AdminAuditDetailPanelProps = {
  record: AdminAuditRecordView;
};

export function AdminAuditDetailPanel({ record }: AdminAuditDetailPanelProps) {
  return (
    <section
      aria-label="Audit record detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Audit record</h2>
        <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{record.id}</p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Action</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{record.action ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{record.status}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Actor</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {record.actorId ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Target type</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{record.targetType ?? "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Target ID</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {record.targetId ?? "—"}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Business reference</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {record.businessReference ?? "—"}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Reason</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{record.reason ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Created</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">
            {record.createdAt ? formatTimestamp(record.createdAt) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Updated</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">
            {record.updatedAt ? formatTimestamp(record.updatedAt) : "—"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
