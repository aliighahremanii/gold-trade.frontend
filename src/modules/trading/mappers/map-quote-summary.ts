import type { QuoteDetail } from "@/modules/quote/api/use-quotes";
import { formatTradeAmount, formatTradeDisplayAmount } from "@/modules/trading/utils/format-trade-amount";

export type QuoteSummaryView = {
  quoteId: string;
  side: string;
  status: string;
  marketSymbol: string;
  quantityLabel: string;
  unitPriceLabel: string;
  feeLabel: string;
  totalIrrLabel: string;
  priceSource: string;
  expiresAt: string;
};

export function mapQuoteDetailToSummary(quote: QuoteDetail, locale = "en-US"): QuoteSummaryView {
  return {
    quoteId: quote.id,
    side: quote.side,
    status: quote.status,
    marketSymbol: quote.market_symbol,
    quantityLabel: formatTradeDisplayAmount(quote.display_amount, quote.display_unit, locale),
    unitPriceLabel: formatTradeAmount(quote.quote_asset_code, quote.unit_price, locale),
    feeLabel: formatTradeAmount(quote.quote_asset_code, quote.fee_amount, locale),
    totalIrrLabel: formatTradeAmount(quote.quote_asset_code, quote.total_quote_amount, locale),
    priceSource: quote.price_source,
    expiresAt: quote.expires_at,
  };
}
