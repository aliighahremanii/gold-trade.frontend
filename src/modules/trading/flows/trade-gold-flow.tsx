"use client";

import { OrderStatusPanel } from "@/modules/trading/components/order-status-panel";
import { QuoteSummaryPanel } from "@/modules/trading/components/quote-summary-panel";
import { TradeAmountForm } from "@/modules/trading/components/trade-amount-form";
import { TradeConfirmationModal } from "@/modules/trading/components/trade-confirmation-modal";
import { TradeErrorAlert } from "@/modules/trading/components/trade-error-alert";
import { useTradeGoldWorkflow } from "@/modules/trading/hooks/use-trade-gold-workflow";
import { TRADE_SIDE, type TradeSide } from "@/modules/trading/utils/trade-market";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

type TradeGoldFlowProps = {
  side: TradeSide;
};

const FLOW_COPY = {
  [TRADE_SIDE.buy]: {
    title: "Buy gold",
    description:
      "Request a backend quote, confirm before expiry, and track order and settlement status. Final pricing always comes from the quote service.",
    sideLabel: "Buy",
  },
  [TRADE_SIDE.sell]: {
    title: "Sell gold",
    description:
      "Request a backend sell quote, confirm before expiry, and track order and settlement status. Locked XAU and IRR settlement remain backend-owned.",
    sideLabel: "Sell",
  },
} as const;

export function TradeGoldFlow({ side }: TradeGoldFlowProps) {
  const copy = FLOW_COPY[side];
  const workflow = useTradeGoldWorkflow({ side });

  return (
    <CustomerWorkflowShell title={copy.title} module="trading" description={copy.description}>
      <div className="flex flex-col gap-6">
        <TradeErrorAlert error={workflow.actionError} />

        {workflow.phase === "idle" || workflow.phase === "quote_loading" ? (
          <TradeAmountForm
            amount={workflow.amountInput}
            sideLabel={copy.sideLabel}
            isSubmitting={workflow.phase === "quote_loading"}
            onAmountChange={workflow.setAmountInput}
            onSubmit={() => {
              void workflow.requestQuote();
            }}
          />
        ) : null}

        {workflow.quoteSummary &&
        (workflow.phase === "quote_ready" ||
          workflow.phase === "quote_expired" ||
          workflow.phase === "confirming") ? (
          <QuoteSummaryPanel
            quote={workflow.quoteSummary}
            isExpired={workflow.phase === "quote_expired"}
            onConfirm={workflow.openConfirmationModal}
            onStartOver={workflow.resetWorkflow}
            isConfirmDisabled={workflow.isSubmitting}
          />
        ) : null}

        {workflow.order &&
        (workflow.phase === "order_tracking" ||
          workflow.phase === "completed" ||
          workflow.phase === "failed" ||
          workflow.phase === "manual_review_required" ||
          workflow.phase === "unknown") ? (
          <OrderStatusPanel order={workflow.order} isPolling={workflow.isOrderPolling} />
        ) : null}

        {workflow.phase === "completed" ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
            Order reached a settled backend state. Wallet balances were refreshed from the server.
          </p>
        ) : null}

        {(workflow.phase === "completed" ||
          workflow.phase === "failed" ||
          workflow.phase === "manual_review_required" ||
          workflow.phase === "unknown") && (
          <button
            type="button"
            onClick={workflow.resetWorkflow}
            className="self-start rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Start another {copy.sideLabel.toLowerCase()}
          </button>
        )}
      </div>

      <TradeConfirmationModal
        isOpen={workflow.isConfirmModalOpen}
        quote={workflow.quoteSummary}
        isSubmitting={workflow.isSubmitting}
        onCancel={workflow.closeConfirmationModal}
        onConfirm={() => {
          void workflow.confirmTrade();
        }}
      />
    </CustomerWorkflowShell>
  );
}
