import { formatIrrAmount } from "@/modules/payments/utils/format-irr-amount";

type WithdrawalConfirmationModalProps = {
  isOpen: boolean;
  amount: number;
  bankAccountReference: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function WithdrawalConfirmationModal({
  isOpen,
  amount,
  bankAccountReference,
  isSubmitting,
  onCancel,
  onConfirm,
}: WithdrawalConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdrawal-confirmation-title"
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2
          id="withdrawal-confirmation-title"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Confirm withdrawal
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You are requesting a withdrawal of {formatIrrAmount(amount)} to bank account reference{" "}
          <span className="font-mono">{bankAccountReference}</span>. The backend will lock wallet balance
          until payout completes or the request is cancelled.
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {isSubmitting ? "Submitting..." : "Confirm withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
}
