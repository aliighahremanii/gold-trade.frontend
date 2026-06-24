import { useQuery } from "@tanstack/react-query";

import type { components as LedgerComponents } from "@/generated/api/ledger";
import { unwrapApiResponse } from "@/shared/api";

import { ledgerClient } from "./client";
import { ledgerQueryKeys } from "./query-keys";

type LedgerProblemResponse = LedgerComponents["schemas"]["ProblemResponse"];
type TransactionDetail = LedgerComponents["schemas"]["TransactionDetail"];
type AccountDetail = LedgerComponents["schemas"]["AccountDetail"];

export async function getLedgerTransaction(transactionId: string): Promise<TransactionDetail> {
  const result = await ledgerClient.GET("/ledger/postings/{id}", {
    params: { path: { id: transactionId } },
  });

  return unwrapApiResponse<TransactionDetail, LedgerProblemResponse>(
    result,
    "Unable to load the ledger transaction.",
  );
}

export async function listLedgerAccountsByOwner(input: {
  ownerId: string;
  ownerType: string;
  assetCode?: string;
}): Promise<AccountDetail[]> {
  const result = await ledgerClient.GET("/ledger/accounts", {
    params: {
      query: {
        owner_id: input.ownerId,
        owner_type: input.ownerType,
        asset_code: input.assetCode,
      },
    },
  });

  return unwrapApiResponse<AccountDetail[], LedgerProblemResponse>(
    result,
    "Unable to load ledger accounts.",
  );
}

export function useLedgerTransaction(transactionId: string | null, enabled = true) {
  return useQuery({
    queryKey: ledgerQueryKeys.transaction(transactionId ?? "unknown"),
    queryFn: () => getLedgerTransaction(transactionId as string),
    enabled: Boolean(transactionId) && enabled,
  });
}

export type { AccountDetail, TransactionDetail };
