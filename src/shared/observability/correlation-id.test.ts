import { describe, expect, it } from "vitest";

import {
  CORRELATION_ID_HEADER,
  getOrCreateCorrelationId,
  readOperationReference,
} from "@/shared/observability/correlation-id";

describe("correlation id", () => {
  it("reads correlation headers in priority order", () => {
    const headers = new Headers({
      [CORRELATION_ID_HEADER]: "corr-123",
      "x-request-id": "req-456",
    });

    expect(readOperationReference(headers)).toBe("corr-123");
  });

  it("creates a correlation id when none is present", () => {
    const headers = new Headers();

    expect(getOrCreateCorrelationId(headers)).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});
