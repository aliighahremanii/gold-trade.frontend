import { formatMilligramsAsGrams } from "@/modules/delivery/utils/format-xau-amount";
import type { ZoneDetail } from "@/modules/delivery/api/use-delivery-zones";
import { mapZoneToLabel } from "@/modules/delivery/mappers/map-delivery-request";

type DeliveryConfirmationModalProps = {
  isOpen: boolean;
  amountMg: number;
  deliveryAddress: string;
  recipientName: string;
  recipientPhone: string;
  zone: ZoneDetail | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeliveryConfirmationModal({
  isOpen,
  amountMg,
  deliveryAddress,
  recipientName,
  recipientPhone,
  zone,
  isSubmitting,
  onCancel,
  onConfirm,
}: DeliveryConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-confirmation-title"
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2
          id="delivery-confirmation-title"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Confirm delivery request
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You are requesting physical delivery of {formatMilligramsAsGrams(amountMg)} to{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-50">{recipientName}</span> (
          {recipientPhone}). The backend will lock wallet gold until delivery completes or the request is
          cancelled.
        </p>

        <dl className="mt-4 flex flex-col gap-2 text-sm">
          <div>
            <dt className="text-zinc-500">Zone</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{zone ? mapZoneToLabel(zone) : "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Address</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{deliveryAddress}</dd>
          </div>
        </dl>

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
            {isSubmitting ? "Submitting..." : "Confirm delivery"}
          </button>
        </div>
      </div>
    </div>
  );
}
