import { DataRefreshStatus } from "@/shared/ui/data-refresh-status";

type PricingRefreshStatusProps = {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  lastUpdatedLabel?: string;
  onRefresh: () => void;
};

export function PricingRefreshStatus(props: PricingRefreshStatusProps) {
  return (
    <DataRefreshStatus
      title="Pricing data status"
      loadingMessage="Loading pricing data..."
      refreshingMessage="Refreshing pricing data..."
      errorFallbackMessage="Pricing data could not be loaded."
      {...props}
    />
  );
}
