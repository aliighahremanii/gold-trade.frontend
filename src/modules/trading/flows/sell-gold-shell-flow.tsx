"use client";

import { TradeGoldFlow } from "@/modules/trading/flows/trade-gold-flow";
import { TRADE_SIDE } from "@/modules/trading/utils/trade-market";

export function SellGoldShellFlow() {
  return <TradeGoldFlow side={TRADE_SIDE.sell} />;
}
