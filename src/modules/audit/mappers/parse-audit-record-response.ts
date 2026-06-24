/**
 * Temporary audit response parsing.
 *
 * The frozen audit OpenAPI contract does not declare JSON response schemas for
 * `/audit/records` list/detail. Generated types therefore expose `content?: never`,
 * which forces runtime parsing into frontend-only `AuditRecordView` types.
 *
 * Replace this parser with generated DTOs once the backend publishes complete audit
 * schemas in `contracts/openapi/audit.openapi.json`.
 */
import type { AuditRecordView } from "@/modules/audit/types/audit-record-view";

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function mapAuditRecord(value: unknown): AuditRecordView | null {
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
    actorId: readString(record.actor_id) ?? readString(record.actorId),
    action: readString(record.action),
    targetType: readString(record.target_type) ?? readString(record.targetType),
    targetId: readString(record.target_id) ?? readString(record.targetId),
    reason: readString(record.reason),
    businessReference:
      readString(record.business_reference) ?? readString(record.businessReference),
    createdAt: readString(record.created_at) ?? readString(record.createdAt),
    updatedAt: readString(record.updated_at) ?? readString(record.updatedAt),
    status: readString(record.status) ?? "recorded",
  };
}

export function parseAuditRecordList(payload: unknown): AuditRecordView[] {
  const items = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && Array.isArray((payload as { items?: unknown }).items)
      ? (payload as { items: unknown[] }).items
      : [];

  return items
    .map((item) => mapAuditRecord(item))
    .filter((item): item is AuditRecordView => item !== null);
}

export function parseAuditRecordDetail(payload: unknown): AuditRecordView | null {
  return mapAuditRecord(payload);
}

export function mapAuditRecordToAdminView(record: AuditRecordView) {
  return {
    ...record,
    references: [
      record.id,
      record.actorId,
      record.targetId,
      record.businessReference,
      record.action,
    ].filter((value): value is string => Boolean(value)),
  };
}

export type AdminAuditRecordView = ReturnType<typeof mapAuditRecordToAdminView>;
