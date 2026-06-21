import { describe, expect, it } from "vitest";

import type { components as IdentityComponents } from "@/generated/api/identity";

import { unwrapApiResponse } from "@/shared/api";

describe("unwrapApiResponse", () => {
  it("returns response data when the request succeeds", () => {
    const data = { id: "user-1" };

    expect(
      unwrapApiResponse({ data, response: new Response(null, { status: 200 }) }, "unused"),
    ).toEqual(data);
  });

  it("throws a normalized API error when the request fails", () => {
    const errorBody: IdentityComponents["schemas"]["ProblemResponse"] = {
      code: "quote_expired",
      message: "Quote expired.",
    };

    try {
      unwrapApiResponse(
        {
          error: errorBody,
          response: new Response(null, { status: 409, statusText: "Conflict" }),
        },
        "Unable to load the current user.",
      );
      throw new Error("Expected unwrapApiResponse to throw.");
    } catch (error) {
      expect(error).toMatchObject({
        kind: "quote_expired",
        message: "Quote expired.",
        status: 409,
      });
    }
  });
});