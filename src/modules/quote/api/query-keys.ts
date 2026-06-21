import { createQueryKeyFactory } from "@/shared/api";

export const quoteQueryKeys = {
  ...createQueryKeyFactory("quote"),
  activeQuote: (quoteId: string) => ["quote", "quotes", quoteId] as const,
};
