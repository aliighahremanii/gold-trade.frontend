import { AuthFormField } from "@/modules/identity/components/auth-form-field";

type DepositAmountFormProps = {
  amount: string;
  isSubmitting: boolean;
  fieldErrors?: { amount?: string };
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
};

export function DepositAmountForm({
  amount,
  isSubmitting,
  fieldErrors,
  onAmountChange,
  onSubmit,
}: DepositAmountFormProps) {
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
        id="deposit-amount"
        name="amount"
        label="Deposit amount (IRR)"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={amount}
        disabled={isSubmitting}
        placeholder="e.g. 5000000"
        error={fieldErrors?.amount}
        aria-invalid={fieldErrors?.amount ? true : undefined}
        onChange={(event) => onAmountChange(event.target.value)}
      />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Enter the amount in whole rials. The backend creates the deposit intent and gateway details.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {isSubmitting ? "Creating deposit..." : "Start deposit"}
      </button>
    </form>
  );
}
