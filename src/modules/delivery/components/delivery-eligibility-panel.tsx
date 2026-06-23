import type { DeliveryEligibilityView } from "@/modules/delivery/mappers/map-delivery-eligibility";

type DeliveryEligibilityPanelProps = {
  eligibility: DeliveryEligibilityView;
  isLoading: boolean;
  isError: boolean;
};

export function DeliveryEligibilityPanel({
  eligibility,
  isLoading,
  isError,
}: DeliveryEligibilityPanelProps) {
  if (isLoading) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading wallet eligibility...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950">
        <p className="text-sm text-red-900 dark:text-red-100">
          Unable to load wallet balances for delivery eligibility.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Delivery eligibility</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Available gold is reported by the wallet service. Delivery locks balance on the backend when a
          request is created.
        </p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Asset</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{eligibility.assetCode}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Available</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">
            {eligibility.availableLabel}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Locked</dt>
          <dd className="font-mono font-medium text-amber-800 dark:text-amber-200">
            {eligibility.lockedLabel}
          </dd>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-3">
          <dt className="text-zinc-500">Total balance</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{eligibility.totalLabel}</dd>
        </div>
      </dl>

      {!eligibility.hasAccount ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
          No {eligibility.assetCode} wallet account was returned. You may need to buy gold before requesting
          delivery.
        </p>
      ) : null}
    </section>
  );
}
