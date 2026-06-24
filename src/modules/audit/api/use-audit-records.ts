import { useQuery } from "@tanstack/react-query";

import { normalizeApiError } from "@/shared/errors";

import { auditClient } from "./client";
import { auditQueryKeys } from "./query-keys";
import {
  parseAuditRecordDetail,
  parseAuditRecordList,
} from "@/modules/audit/mappers/parse-audit-record-response";
import type { AuditRecordView } from "@/modules/audit/types/audit-record-view";

/**
 * Audit hooks use manual JSON parsing because the generated audit schema omits response bodies.
 * See `parse-audit-record-response.ts` for the contract gap and removal criteria.
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

async function listAuditRecords(): Promise<AuditRecordView[]> {
  const result = await auditClient.GET("/audit/records");

  if (!result.response.ok) {
    throw normalizeApiError({
      status: result.response.status,
      body: result.error,
      fallbackMessage: "Unable to load audit records.",
    });
  }

  const payload = result.data ?? (await readJsonBody(result.response));
  return parseAuditRecordList(payload);
}

async function getAuditRecord(recordId: string): Promise<AuditRecordView> {
  const result = await auditClient.GET("/audit/records/{id}", {
    params: { path: { id: recordId } },
  } as never);

  if (!result.response.ok) {
    throw normalizeApiError({
      status: result.response.status,
      body: result.error,
      fallbackMessage: "Unable to load the audit record.",
    });
  }

  const payload = result.data ?? (await readJsonBody(result.response));
  const record = parseAuditRecordDetail(payload);

  if (!record) {
    throw normalizeApiError({
      status: result.response.status,
      fallbackMessage: "Audit record response was not recognized.",
    });
  }

  return record;
}

export function useAuditRecords(enabled = true) {
  return useQuery({
    queryKey: auditQueryKeys.records({}),
    queryFn: listAuditRecords,
    enabled,
  });
}

export function useAuditRecord(recordId: string | null, enabled = true) {
  return useQuery({
    queryKey: auditQueryKeys.record(recordId ?? "unknown"),
    queryFn: () => getAuditRecord(recordId as string),
    enabled: Boolean(recordId) && enabled,
  });
}

export { getAuditRecord, listAuditRecords };
