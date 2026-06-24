import type { NormalizedApiError } from "@/shared/errors";
import { logOperationalError } from "@/shared/observability/safe-logger";

type ReportApiErrorContext = {
  scope: string;
  operationReference?: string;
};

export function reportApiError(error: NormalizedApiError, context: ReportApiErrorContext) {
  logOperationalError("api_error", {
    scope: context.scope,
    kind: error.kind,
    status: error.status,
    code: error.code,
    message: error.message,
    operationReference: context.operationReference ?? error.operationReference,
  });
}
