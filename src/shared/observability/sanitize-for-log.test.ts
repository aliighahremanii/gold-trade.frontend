import { describe, expect, it } from "vitest";

import { isSensitiveLogKey, sanitizeForLog } from "@/shared/observability/sanitize-for-log";

describe("sanitizeForLog", () => {
  it("redacts sensitive keys recursively", () => {
    expect(
      sanitizeForLog({
        orderId: "order-1",
        accessToken: "secret-token",
        nested: {
          bankAccountReference: "IR123",
          status: "pending",
        },
      }),
    ).toEqual({
      orderId: "order-1",
      accessToken: "[redacted]",
      nested: {
        bankAccountReference: "[redacted]",
        status: "pending",
      },
    });
  });

  it("flags common sensitive key names", () => {
    expect(isSensitiveLogKey("refreshToken")).toBe(true);
    expect(isSensitiveLogKey("marketSymbol")).toBe(false);
  });
});
