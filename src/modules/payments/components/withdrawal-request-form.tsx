import { AuthFormField } from "@/modules/identity/components/auth-form-field";

type WithdrawalRequestFormProps = {
  amount: string;
  bankAccountReference: string;
  isSubmitting: boolean;
  fieldErrors?: {
    amount?: string;
    bankAccountReference?: string;
  };
  onAmountChange: (value: string) => void;
  onBankAccountReferenceChange: (value: string) => void;
  onSubmit: () => void;
};

export function WithdrawalRequestForm({
  amount,
  bankAccountReference,
  isSubmitting,
  fieldErrors,
  onAmountChange,
  onBankAccountReferenceChange,
  onSubmit,
}: WithdrawalRequestFormProps) {
  return (
    <form
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      noValidate
    >
      <AuthFormField
        id="withdraw-amount"
        name="amount"
        label="Withdrawal amount (IRR)"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={amount}
        disabled={isSubmitting}
        placeholder="e.g. 2000000"
        error={fieldErrors?.amount}
        aria-invalid={fieldErrors?.amount ? true : undefined}
        onChange={(event) => onAmountChange(event.target.value)}
      />

      <AuthFormField
        id="bank-account-reference"
        name="bankAccountReference"
        label="Bank account reference"
        type="text"
        autoComplete="off"
        value={bankAccountReference}
        disabled={isSubmitting}
        placeholder="Saved payout account reference"
        error={fieldErrors?.bankAccountReference}
        aria-invalid={fieldErrors?.bankAccountReference ? true : undefined}
        onChange={(event) => onBankAccountReferenceChange(event.target.value)}
      />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The backend locks wallet balance when the withdrawal is created. Payout status updates from payment
        APIs.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {isSubmitting ? "Preparing review..." : "Review withdrawal"}
      </button>
    </form>
  );
}
