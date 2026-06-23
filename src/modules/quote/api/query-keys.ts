import { createQueryKeyFactory } from "@/shared/api";

export const quoteQueryKeys = {
  ...createQueryKeyFactory("quote"),
  quote: (quoteId: string) => ["quote", "quotes", quoteId] as const,
  confirmationEligibility: (quoteId: string) =>
    ["quote", "quotes", quoteId, "confirmation-eligibility"] as const,
};
