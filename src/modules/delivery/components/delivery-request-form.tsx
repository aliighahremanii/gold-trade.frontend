import type { ZoneDetail } from "@/modules/delivery/api/use-delivery-zones";
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
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="delivery-amount" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Gold amount (grams)
        </label>
        <input
          id="delivery-amount"
          name="amountGrams"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={amountGrams}
          disabled={isSubmitting}
          onChange={(event) => onAmountGramsChange(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="e.g. 5"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Amount is sent to the backend in milligrams. Final eligibility is validated server-side.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="delivery-zone" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Delivery zone
        </label>
        <select
          id="delivery-zone"
          name="deliveryZoneId"
          value={deliveryZoneId}
          disabled={isSubmitting || zonesLoading || activeZones.length === 0}
          onChange={(event) => onDeliveryZoneIdChange(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
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
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="delivery-address" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Delivery address
        </label>
        <textarea
          id="delivery-address"
          name="deliveryAddress"
          rows={3}
          value={deliveryAddress}
          disabled={isSubmitting}
          onChange={(event) => onDeliveryAddressChange(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="Street, building, and delivery instructions"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="recipient-name" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Recipient name
          </label>
          <input
            id="recipient-name"
            name="recipientName"
            type="text"
            autoComplete="name"
            value={recipientName}
            disabled={isSubmitting}
            onChange={(event) => onRecipientNameChange(event.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="recipient-phone" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Recipient phone
          </label>
          <input
            id="recipient-phone"
            name="recipientPhone"
            type="tel"
            autoComplete="tel"
            value={recipientPhone}
            disabled={isSubmitting}
            onChange={(event) => onRecipientPhoneChange(event.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>
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
