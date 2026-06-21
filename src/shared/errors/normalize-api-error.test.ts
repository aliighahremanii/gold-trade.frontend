import { describe, expect, it } from "vitest";

import { normalizeApiError } from "@/shared/errors";

describe("normalizeApiError", () => {
  it("maps validation problem details", () => {
    const error = normalizeApiError({
      status: 422,
      body: {
        code: "validation_error",
        message: "Invalid request.",
        errors: [{ code: "amount", message: "Amount is required." }],
      },
    });

    expect(error).toMatchObject({
      kind: "validation_error",
      status: 422,
      code: "validation_error",
      message: "Invalid request.",
      fieldErrors: [{ code: "amount", message: "Amount is required." }],
    });
  });

  it("maps known financial workflow codes", () => {
    const error = normalizeApiError({
      status: 409,
      body: {
        code: "quote_expired",
        message: "Quote expired.",
      },
    });

    expect(error.kind).toBe("quote_expired");
    expect(error.message).toBe("Quote expired.");
  });

  it("falls back to HTTP status when problem code is unknown", () => {
    const error = normalizeApiError({
      status: 401,
      body: {
        code: "session_revoked",
        message: "Session revoked.",
      },
    });

    expect(error.kind).toBe("authentication_error");
  });
});
