import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { components as QuoteComponents } from "@/generated/api/quote";
import { unwrapApiResponse } from "@/shared/api";

import { quoteClient } from "./client";
import { quoteQueryKeys } from "./query-keys";

type QuoteProblemResponse = QuoteComponents["schemas"]["ProblemResponse"];
type CreateQuoteRequest = QuoteComponents["schemas"]["CreateQuoteRequest"];
type QuoteDetail = QuoteComponents["schemas"]["QuoteDetail"];
type ConfirmationEligibility = QuoteComponents["schemas"]["ConfirmationEligibility"];

export async function createQuote(request: CreateQuoteRequest): Promise<QuoteDetail> {
  const result = await quoteClient.POST("/quotes", { body: request });

  return unwrapApiResponse<QuoteDetail, QuoteProblemResponse>(result, "Unable to create a quote.");
}

export async function getQuote(quoteId: string): Promise<QuoteDetail> {
  const result = await quoteClient.GET("/quotes/{id}", {
    params: { path: { id: quoteId } },
  });

  return unwrapApiResponse<QuoteDetail, QuoteProblemResponse>(result, "Unable to load the quote.");
}

export async function getQuoteConfirmationEligibility(
  quoteId: string,
): Promise<ConfirmationEligibility> {
  const result = await quoteClient.GET("/quotes/{id}/confirmation-eligibility", {
    params: { path: { id: quoteId } },
  });

  return unwrapApiResponse<ConfirmationEligibility, QuoteProblemResponse>(
    result,
    "Unable to check quote confirmation eligibility.",
  );
}

export async function confirmQuote(quoteId: string): Promise<QuoteDetail> {
  const result = await quoteClient.POST("/quote/quotes/{id}/confirm", {
    params: { path: { id: quoteId } },
  });

  return unwrapApiResponse<QuoteDetail, QuoteProblemResponse>(result, "Unable to confirm the quote.");
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuote,
    onSuccess: (quote) => {
      queryClient.setQueryData(quoteQueryKeys.quote(quote.id), quote);
    },
  });
}

export function useQuote(quoteId: string | null, enabled = true) {
  return useQuery({
    queryKey: quoteQueryKeys.quote(quoteId ?? "unknown"),
    queryFn: () => getQuote(quoteId as string),
    enabled: Boolean(quoteId) && enabled,
  });
}

export function useQuoteConfirmationEligibility(quoteId: string | null, enabled = true) {
  return useQuery({
    queryKey: quoteQueryKeys.confirmationEligibility(quoteId ?? "unknown"),
    queryFn: () => getQuoteConfirmationEligibility(quoteId as string),
    enabled: Boolean(quoteId) && enabled,
  });
}

export function useConfirmQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmQuote,
    onSuccess: (quote) => {
      queryClient.setQueryData(quoteQueryKeys.quote(quote.id), quote);
    },
  });
}

export type { CreateQuoteRequest, QuoteDetail, ConfirmationEligibility };
