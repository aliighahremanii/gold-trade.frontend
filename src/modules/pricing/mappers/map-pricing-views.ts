import type { PriceSnapshotDetail, SelectedPriceDetail } from "@/modules/pricing/api/use-market-pricing";
import {
  formatIrrPriceAmount,
  formatPricingTimestamp,
} from "@/modules/pricing/utils/format-price-amount";
import { formatMarketStatusLabel } from "@/modules/pricing/utils/market-status";

export type SelectedPriceView = {
  marketSymbol: string;
  marketStatus: string;
  marketStatusLabel: string;
  source: string;
  buyPriceLabel: string;
  sellPriceLabel: string;
  quotePerBaseUnit: string;
  effectiveFromLabel: string;
  selectedAtLabel: string;
  priceSnapshotId: string;
};

export type PriceSnapshotView = {
  id: string;
  source: string;
  buyPriceLabel: string;
  sellPriceLabel: string;
  quotePerBaseUnit: string;
  reason?: string;
  actorId?: string;
  effectiveFromLabel: string;
  expiresAtLabel?: string;
  createdAtLabel: string;
};

export function mapSelectedPriceToView(price: SelectedPriceDetail): SelectedPriceView {
  return {
    marketSymbol: price.market_symbol,
    marketStatus: price.market_status,
    marketStatusLabel: formatMarketStatusLabel(price.market_status),
    source: price.source,
    buyPriceLabel: formatIrrPriceAmount(price.buy_price),
    sellPriceLabel: formatIrrPriceAmount(price.sell_price),
    quotePerBaseUnit: price.quote_per_base_unit,
    effectiveFromLabel: formatPricingTimestamp(price.effective_from),
    selectedAtLabel: formatPricingTimestamp(price.selected_at),
    priceSnapshotId: price.price_snapshot_id,
  };
}

export function mapPriceSnapshotToView(snapshot: PriceSnapshotDetail): PriceSnapshotView {
  return {
    id: snapshot.id,
    source: snapshot.source,
    buyPriceLabel: formatIrrPriceAmount(snapshot.buy_price),
    sellPriceLabel: formatIrrPriceAmount(snapshot.sell_price),
    quotePerBaseUnit: snapshot.quote_per_base_unit,
    reason: snapshot.reason,
    actorId: snapshot.actor_id,
    effectiveFromLabel: formatPricingTimestamp(snapshot.effective_from),
    expiresAtLabel: snapshot.expires_at ? formatPricingTimestamp(snapshot.expires_at) : undefined,
    createdAtLabel: formatPricingTimestamp(snapshot.created_at),
  };
}
