"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useApproveOrder } from "@/modules/admin/api/use-admin-orders";
import { AdminActionConfirmationModal } from "@/modules/admin/components/admin-action-confirmation-modal";
import { ApiErrorAlert, toNormalizedApiError } from "@/shared/errors";
import { useOrder } from "@/modules/trading/api/use-orders";
import { AdminOrderDetailPanel } from "@/modules/trading/components/admin-order-detail-panel";
import { mapOrderDetailToAdminView } from "@/modules/trading/mappers/map-order-detail";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";

type AdminOrderDetailFlowProps = {
  orderId: string;
};

export function AdminOrderDetailFlow({ orderId }: AdminOrderDetailFlowProps) {
  const orderQuery = useOrder(orderId);
  const approveOrderMutation = useApproveOrder();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitted">("idle");

  const order = useMemo(
    () => (orderQuery.data ? mapOrderDetailToAdminView(orderQuery.data) : null),
    [orderQuery.data],
  );

  async function confirmApprove() {
    const trimmedReason = approvalReason.trim();

    if (!trimmedReason) {
      setActionError({
        kind: "validation_error",
        status: 400,
        message: "A reason is required before approving an order.",
        code: "validation_error",
        fieldErrors: [],
      });
      return;
    }

    setActionError(null);

    try {
      await approveOrderMutation.mutateAsync(orderId);
      setIsApproveModalOpen(false);
      setApprovalReason("");
      setSubmitState("submitted");
      await orderQuery.refetch();
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  }

  return (
    <AdminWorkflowShell
      title="Order detail"
      module="trading"
      description="Backend order state, provider execution visibility, and manual approval actions."
    >
      <div className="flex flex-col gap-4">
        <Link href="/admin/orders" className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
          Back to orders
        </Link>

        {submitState === "submitted" ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
            Approval submitted. Refresh to confirm the backend-reported order status.
          </p>
        ) : null}

        <ApiErrorAlert error={actionError} />

        {orderQuery.isLoading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading order...</p>
        ) : null}

        {orderQuery.isError ? (
          <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
            {orderQuery.error instanceof Error ? orderQuery.error.message : "Unable to load order."}
          </p>
        ) : null}

        {order ? (
          <AdminOrderDetailPanel
            order={order}
            isApproving={approveOrderMutation.isPending}
            onApprove={() => {
              setActionError(null);
              setApprovalReason("");
              setIsApproveModalOpen(true);
            }}
          />
        ) : null}

        <AdminActionConfirmationModal
          isOpen={isApproveModalOpen}
          title="Confirm order approval"
          description="This action requests backend execution for a manual-review order."
          confirmLabel="Confirm approval"
          reason={approvalReason}
          isSubmitting={approveOrderMutation.isPending}
          onReasonChange={setApprovalReason}
          onCancel={() => {
            if (!approveOrderMutation.isPending) {
              setIsApproveModalOpen(false);
            }
          }}
          onConfirm={() => {
            void confirmApprove();
          }}
        />
      </div>
    </AdminWorkflowShell>
  );
}
