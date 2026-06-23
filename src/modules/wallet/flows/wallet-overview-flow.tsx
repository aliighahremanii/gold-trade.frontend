"use client";

import { useMemo } from "react";

import { useMyWalletAccounts } from "@/modules/wallet/api/use-wallet-accounts";
import { WalletAssetTable } from "@/modules/wallet/components/wallet-asset-table";
import { WalletBalanceCard } from "@/modules/wallet/components/wallet-balance-card";
import { WalletRefreshStatus } from "@/modules/wallet/components/wallet-refresh-status";
import { mapWalletAccountsToBalanceViews } from "@/modules/wallet/mappers/map-wallet-account";
import { getLatestWalletUpdatedAt } from "@/modules/wallet/utils/format-wallet-timestamp";
import { type NormalizedApiError } from "@/shared/errors";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

function getQueryErrorMessage(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as NormalizedApiError).message === "string"
  ) {
    return (error as NormalizedApiError).message;
  }

  return undefined;
}

export function WalletOverviewFlow() {
  const accountsQuery = useMyWalletAccounts();

  const assetBalances = useMemo(
    () => mapWalletAccountsToBalanceViews(accountsQuery.data ?? []),
    [accountsQuery.data],
  );

  const lastUpdatedAt = useMemo(() => getLatestWalletUpdatedAt(assetBalances), [assetBalances]);
  const queryErrorMessage = getQueryErrorMessage(accountsQuery.error);

  return (
    <CustomerWorkflowShell
      title="Wallet"
      module="wallet"
      description="IRR and XAU balances from the wallet service. Amounts are shown in display units while preserving backend stored units."
    >
      <div className="flex flex-col gap-6">
        <WalletRefreshStatus
          lastUpdatedAt={lastUpdatedAt}
          isLoading={accountsQuery.isLoading}
          isFetching={accountsQuery.isFetching}
          isError={accountsQuery.isError}
          errorMessage={queryErrorMessage}
          onRefresh={() => {
            void accountsQuery.refetch();
          }}
        />

        {!accountsQuery.isLoading && !accountsQuery.isError ? (
          <>
            <section className="flex flex-col gap-4" aria-label="Balance cards">
              {assetBalances.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Open IRR and XAU wallet accounts to see available, locked, and total balances here.
                </p>
              ) : (
                assetBalances.map((asset) => <WalletBalanceCard key={asset.accountId} asset={asset} />)
              )}
            </section>

            <section className="flex flex-col gap-3" aria-label="Portfolio table">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Portfolio</h2>
              <WalletAssetTable assets={assetBalances} />
            </section>
          </>
        ) : null}
      </div>
    </CustomerWorkflowShell>
  );
}
