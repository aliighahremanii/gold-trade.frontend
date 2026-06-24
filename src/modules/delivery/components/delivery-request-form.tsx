import type { ZoneDetail } from "@/modules/delivery/api/use-delivery-zones";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { mapZoneToLabel } from "@/modules/delivery/mappers/map-delivery-request";

type DeliveryRequestFormProps = {
  amountGrams: string;
  deliveryAddress: string;
  recipientName: string;
  recipientPhone: string;
  deliveryZoneId: string;
  zones: ZoneDetail[];
  zonesLoading: boolean;
  zonesError: boolean;
  isSubmitting: boolean;
  fieldErrors?: {
    amountGrams?: string;
    deliveryZoneId?: string;
    deliveryAddress?: string;
    recipientName?: string;
    recipientPhone?: string;
  };
  onAmountGramsChange: (value: string) => void;
  onDeliveryAddressChange: (value: string) => void;
  onRecipientNameChange: (value: string) => void;
  onRecipientPhoneChange: (value: string) => void;
  onDeliveryZoneIdChange: (value: string) => void;
  onSubmit: () => void;
};

export function DeliveryRequestForm({
  amountGrams,
  deliveryAddress,
  recipientName,
  recipientPhone,
  deliveryZoneId,
  zones,
  zonesLoading,
  zonesError,
  isSubmitting,
  fieldErrors,
  onAmountGramsChange,
  onDeliveryAddressChange,
  onRecipientNameChange,
  onRecipientPhoneChange,
  onDeliveryZoneIdChange,
  onSubmit,
}: DeliveryRequestFormProps) {
  const activeZones = zones.filter((zone) => zone.active);

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
        id="delivery-amount"
        name="amountGrams"
        label="Gold amount (grams)"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={amountGrams}
        disabled={isSubmitting}
        placeholder="e.g. 5"
        error={fieldErrors?.amountGrams}
        aria-invalid={fieldErrors?.amountGrams ? true : undefined}
        onChange={(event) => onAmountGramsChange(event.target.value)}
      />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Amount is sent to the backend in milligrams. Final eligibility is validated server-side.
      </p>

      <label htmlFor="delivery-zone" className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">Delivery zone</span>
        <select
          id="delivery-zone"
          name="deliveryZoneId"
          value={deliveryZoneId}
          disabled={isSubmitting || zonesLoading || activeZones.length === 0}
          aria-invalid={fieldErrors?.deliveryZoneId ? true : undefined}
          onChange={(event) => onDeliveryZoneIdChange(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        >
          <option value="">
            {zonesLoading ? "Loading zones..." : zonesError ? "Unable to load zones" : "Select a zone"}
          </option>
          {activeZones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {mapZoneToLabel(zone)}
            </option>
          ))}
        </select>
        {fieldErrors?.deliveryZoneId ? (
          <span className="text-red-700 dark:text-red-300">{fieldErrors.deliveryZoneId}</span>
        ) : null}
      </label>

      <label htmlFor="delivery-address" className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">Delivery address</span>
        <textarea
          id="delivery-address"
          name="deliveryAddress"
          rows={3}
          value={deliveryAddress}
          disabled={isSubmitting}
          aria-invalid={fieldErrors?.deliveryAddress ? true : undefined}
          onChange={(event) => onDeliveryAddressChange(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="Street, building, and delivery instructions"
        />
        {fieldErrors?.deliveryAddress ? (
          <span className="text-red-700 dark:text-red-300">{fieldErrors.deliveryAddress}</span>
        ) : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <AuthFormField
          id="recipient-name"
          name="recipientName"
          label="Recipient name"
          type="text"
          autoComplete="name"
          value={recipientName}
          disabled={isSubmitting}
          error={fieldErrors?.recipientName}
          aria-invalid={fieldErrors?.recipientName ? true : undefined}
          onChange={(event) => onRecipientNameChange(event.target.value)}
        />

        <AuthFormField
          id="recipient-phone"
          name="recipientPhone"
          label="Recipient phone"
          type="tel"
          autoComplete="tel"
          value={recipientPhone}
          disabled={isSubmitting}
          error={fieldErrors?.recipientPhone}
          aria-invalid={fieldErrors?.recipientPhone ? true : undefined}
          onChange={(event) => onRecipientPhoneChange(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {isSubmitting ? "Preparing review..." : "Review delivery request"}
      </button>
    </form>
  );
}
