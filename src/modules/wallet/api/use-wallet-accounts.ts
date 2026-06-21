import { useQuery } from "@tanstack/react-query";

import type { components as WalletComponents, paths as WalletPaths } from "@/generated/api/wallet";
import { unwrapApiResponse } from "@/shared/api";

import { walletClient } from "./client";
import { walletQueryKeys } from "./query-keys";

type WalletProblemResponse = WalletComponents["schemas"]["ProblemResponse"];
type MyAccountsResponse =
  WalletPaths["/wallet/me/accounts"]["get"]["responses"][200]["content"]["application/json"];
type MyAccountResponse =
  WalletPaths["/wallet/me/accounts/{id}"]["get"]["responses"][200]["content"]["application/json"];
type MyBalanceResponse =
  WalletPaths["/wallet/me/accounts/{id}/balance"]["get"]["responses"][200]["content"]["application/json"];

export async function getMyWalletAccounts(): Promise<MyAccountsResponse> {
  const result = await walletClient.GET("/wallet/me/accounts");

  return unwrapApiResponse<MyAccountsResponse, WalletProblemResponse>(
    result,
    "Unable to load wallet accounts.",
  );
}

export async function getMyWalletAccount(accountId: string): Promise<MyAccountResponse> {
  const result = await walletClient.GET("/wallet/me/accounts/{id}", {
    params: {
      path: { id: accountId },
    },
  });

  return unwrapApiResponse<MyAccountResponse, WalletProblemResponse>(
    result,
    "Unable to load the wallet account.",
  );
}

export async function getMyWalletBalance(accountId: string): Promise<MyBalanceResponse> {
  const result = await walletClient.GET("/wallet/me/accounts/{id}/balance", {
    params: {
      path: { id: accountId },
    },
  });

  return unwrapApiResponse<MyBalanceResponse, WalletProblemResponse>(
    result,
    "Unable to load the wallet balance.",
  );
}

export function useMyWalletAccounts() {
  return useQuery({
    queryKey: walletQueryKeys.myAccounts(),
    queryFn: getMyWalletAccounts,
  });
}

export function useMyWalletAccount(accountId: string) {
  return useQuery({
    queryKey: walletQueryKeys.myAccount(accountId),
    queryFn: () => getMyWalletAccount(accountId),
  });
}

export function useMyWalletBalance(accountId: string) {
  return useQuery({
    queryKey: walletQueryKeys.myBalance(accountId),
    queryFn: () => getMyWalletBalance(accountId),
  });
}