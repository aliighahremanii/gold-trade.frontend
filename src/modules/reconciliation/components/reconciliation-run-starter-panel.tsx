"use client";

import { AuthFormField } from "@/modules/identity/components/auth-form-field";

type ReconciliationRunStarterPanelProps = {
  isSubmitting: boolean;
  onStartWalletLedger: (input: { userId: string; assetCode: string }) => void;
  onStartProviderExecution: (input: {
    executionId: string;
    orderId: string;
    providerCode: string;
    marketSymbol: string;
    baseAmount: string;
    side: string;
  }) => void;
  onStartPayment: (input: {
    paymentType: string;
    internalId: string;
    userId: string;
    internalAmount: string;
    externalAmount: string;
    externalBankReference: string;
    internalStatus: string;
  }) => void;
  onStartDelivery: (input: {
    requestId: string;
    userId: string;
    internalAssetCode: string;
    internalAmount: string;
    externalAmount: string;
    externalCustodyReference: string;
    internalStatus: string;
  }) => void;
};

function parseAmount(value: string): number {
  const parsed = Number(value.trim());

  return Number.isFinite(parsed) ? parsed : 0;
}

export function ReconciliationRunStarterPanel({
  isSubmitting,
  onStartWalletLedger,
  onStartProviderExecution,
  onStartPayment,
  onStartDelivery,
}: ReconciliationRunStarterPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);

          onStartWalletLedger({
            userId: String(formData.get("wallet-user-id") ?? ""),
            assetCode: String(formData.get("wallet-asset-code") ?? ""),
          });
        }}
      >
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Wallet vs ledger</h3>
        <AuthFormField
          id="wallet-user-id"
          name="wallet-user-id"
          label="User ID"
          required
        />
        <AuthFormField
          id="wallet-asset-code"
          name="wallet-asset-code"
          label="Asset code"
          defaultValue="IRR"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Start comparison
        </button>
      </form>

      <form
        className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);

          onStartProviderExecution({
            executionId: String(formData.get("provider-execution-id") ?? ""),
            orderId: String(formData.get("provider-order-id") ?? ""),
            providerCode: String(formData.get("provider-code") ?? ""),
            marketSymbol: String(formData.get("provider-market-symbol") ?? "XAU-IRR"),
            baseAmount: String(formData.get("provider-base-amount") ?? "0"),
            side: String(formData.get("provider-side") ?? "buy"),
          });
        }}
      >
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Provider vs trades</h3>
        <AuthFormField id="provider-execution-id" name="provider-execution-id" label="Execution ID" required />
        <AuthFormField id="provider-order-id" name="provider-order-id" label="Order ID" required />
        <AuthFormField id="provider-code" name="provider-code" label="Provider code" required />
        <AuthFormField
          id="provider-market-symbol"
          name="provider-market-symbol"
          label="Market symbol"
          defaultValue="XAU-IRR"
          required
        />
        <AuthFormField
          id="provider-base-amount"
          name="provider-base-amount"
          label="Internal base amount"
          defaultValue="0"
          required
        />
        <AuthFormField id="provider-side" name="provider-side" label="Internal side" defaultValue="buy" required />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Start comparison
        </button>
      </form>

      <form
        className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);

          onStartPayment({
            paymentType: String(formData.get("payment-type") ?? "deposit"),
            internalId: String(formData.get("payment-internal-id") ?? ""),
            userId: String(formData.get("payment-user-id") ?? ""),
            internalAmount: String(formData.get("payment-internal-amount") ?? "0"),
            externalAmount: String(formData.get("payment-external-amount") ?? "0"),
            externalBankReference: String(formData.get("payment-external-bank-reference") ?? ""),
            internalStatus: String(formData.get("payment-internal-status") ?? "pending"),
          });
        }}
      >
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Bank vs payments</h3>
        <AuthFormField id="payment-type" name="payment-type" label="Payment type" defaultValue="deposit" required />
        <AuthFormField id="payment-internal-id" name="payment-internal-id" label="Internal payment ID" required />
        <AuthFormField id="payment-user-id" name="payment-user-id" label="User ID" required />
        <AuthFormField
          id="payment-internal-amount"
          name="payment-internal-amount"
          label="Internal amount"
          defaultValue="0"
          required
        />
        <AuthFormField
          id="payment-external-amount"
          name="payment-external-amount"
          label="External amount"
          defaultValue="0"
          required
        />
        <AuthFormField
          id="payment-external-bank-reference"
          name="payment-external-bank-reference"
          label="External bank reference"
          required
        />
        <AuthFormField
          id="payment-internal-status"
          name="payment-internal-status"
          label="Internal status"
          defaultValue="pending"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Start comparison
        </button>
      </form>

      <form
        className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);

          onStartDelivery({
            requestId: String(formData.get("delivery-request-id") ?? ""),
            userId: String(formData.get("delivery-user-id") ?? ""),
            internalAssetCode: String(formData.get("delivery-asset-code") ?? "XAU"),
            internalAmount: String(formData.get("delivery-internal-amount") ?? "0"),
            externalAmount: String(formData.get("delivery-external-amount") ?? "0"),
            externalCustodyReference: String(formData.get("delivery-external-custody-reference") ?? ""),
            internalStatus: String(formData.get("delivery-internal-status") ?? "completed"),
          });
        }}
      >
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Physical custody vs liabilities
        </h3>
        <AuthFormField id="delivery-request-id" name="delivery-request-id" label="Request ID" required />
        <AuthFormField id="delivery-user-id" name="delivery-user-id" label="User ID" required />
        <AuthFormField
          id="delivery-asset-code"
          name="delivery-asset-code"
          label="Internal asset code"
          defaultValue="XAU"
          required
        />
        <AuthFormField
          id="delivery-internal-amount"
          name="delivery-internal-amount"
          label="Internal amount"
          defaultValue="0"
          required
        />
        <AuthFormField
          id="delivery-external-amount"
          name="delivery-external-amount"
          label="External amount"
          defaultValue="0"
          required
        />
        <AuthFormField
          id="delivery-external-custody-reference"
          name="delivery-external-custody-reference"
          label="External custody reference"
          required
        />
        <AuthFormField
          id="delivery-internal-status"
          name="delivery-internal-status"
          label="Internal status"
          defaultValue="completed"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Start comparison
        </button>
      </form>
    </div>
  );
}

export { parseAmount };
