export const CORRELATION_ID_HEADER = "x-correlation-id";
export const REQUEST_ID_HEADER = "x-request-id";

const HEADER_CANDIDATES = [CORRELATION_ID_HEADER, REQUEST_ID_HEADER, "traceparent"] as const;

export function readOperationReference(headers: Headers): string | undefined {
  for (const headerName of HEADER_CANDIDATES) {
    const value = headers.get(headerName)?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}

export function getOrCreateCorrelationId(headers: Headers): string {
  const existing = readOperationReference(headers);

  if (existing) {
    return existing;
  }

  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `corr-${Date.now()}`;
}
