"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  useCancelDeliveryRequest,
  useDeliveryRequest,
  useRequestDelivery,
} from "@/modules/delivery/api/use-delivery-requests";
import { useDeliveryZones } from "@/modules/delivery/api/use-delivery-zones";
import { toNormalizedApiError } from "@/modules/delivery/components/delivery-error-alert";
import { mapXauWalletToEligibility } from "@/modules/delivery/mappers/map-delivery-eligibility";
import { mapDeliveryRequestToStatusView } from "@/modules/delivery/mappers/map-delivery-request";
import {
  gramsInputToMilligrams,
  isValidGramsInput,
  XAU_ASSET_CODE,
} from "@/modules/delivery/utils/format-xau-amount";
import {
  isSuccessfulDeliveryStatus,
  isTerminalDeliveryStatus,
} from "@/modules/delivery/utils/delivery-status";
import {
  readDeliverySessionIds,
  rememberDeliverySessionId,
} from "@/modules/delivery/utils/delivery-session";
import { useMyWalletAccounts } from "@/modules/wallet/api/use-wallet-accounts";
import { walletQueryKeys } from "@/modules/wallet/api/query-keys";
import { createIdempotencyKey } from "@/shared/utils/idempotency";
import {
  clearFieldError,
  type WorkflowFieldErrors,
} from "@/shared/forms/workflow-field-errors";
import {
  idempotencyKeyAfterSuccessfulMutation,
  resolveIdempotencyKey,
} from "@/modules/payments/utils/withdrawal-idempotency";

export function useRequestDeliveryWorkflow() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const idempotencyKeyRef = useRef<string | null>(null);
  const walletInvalidatedRef = useRef(false);

  const [amountGrams, setAmountGramsState] = useState("");
  const [deliveryAddress, setDeliveryAddressState] = useState("");
  const [recipientName, setRecipientNameState] = useState("");
  const [recipientPhone, setRecipientPhoneState] = useState("");
  const [deliveryZoneId, setDeliveryZoneIdState] = useState("");
  const [sessionRequestIds, setSessionRequestIds] = useState<string[]>(() => readDeliverySessionIds());
  const [latestRequestId, setLatestRequestId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const [fieldErrors, setFieldErrors] = useState<WorkflowFieldErrors>({});

  const setAmountGrams = useCallback((value: string) => {
    setAmountGramsState(value);
    setFieldErrors((current) => clearFieldError(current, "amountGrams"));
  }, []);

  const setDeliveryAddress = useCallback((value: string) => {
    setDeliveryAddressState(value);
    setFieldErrors((current) => clearFieldError(current, "deliveryAddress"));
  }, []);

  const setRecipientName = useCallback((value: string) => {
    setRecipientNameState(value);
    setFieldErrors((current) => clearFieldError(current, "recipientName"));
  }, []);

  const setRecipientPhone = useCallback((value: string) => {
    setRecipientPhoneState(value);
    setFieldErrors((current) => clearFieldError(current, "recipientPhone"));
  }, []);

  const setDeliveryZoneId = useCallback((value: string) => {
    setDeliveryZoneIdState(value);
    setFieldErrors((current) => clearFieldError(current, "deliveryZoneId"));
  }, []);

  const walletQuery = useMyWalletAccounts();
  const zonesQuery = useDeliveryZones();
  const requestDeliveryMutation = useRequestDelivery();
  const latestRequestQuery = useDeliveryRequest(latestRequestId, Boolean(latestRequestId));
  const cancelDeliveryMutation = useCancelDeliveryRequest();

  const eligibility = useMemo(
    () => mapXauWalletToEligibility(walletQuery.data ?? []),
    [walletQuery.data],
  );

  const latestRequestView = useMemo(
    () =>
      latestRequestQuery.data ? mapDeliveryRequestToStatusView(latestRequestQuery.data) : null,
    [latestRequestQuery.data],
  );

  const pendingAmountMg = useMemo(() => {
    try {
      return gramsInputToMilligrams(amountGrams);
    } catch {
      return null;
    }
  }, [amountGrams]);

  const selectedZone = useMemo(
    () => (zonesQuery.data ?? []).find((zone) => zone.id === deliveryZoneId) ?? null,
    [deliveryZoneId, zonesQuery.data],
  );

  useEffect(() => {
    const request = latestRequestQuery.data;
    if (!request || !isTerminalDeliveryStatus(request.status) || walletInvalidatedRef.current) {
      return;
    }

    walletInvalidatedRef.current = true;
    void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
  }, [latestRequestQuery.data, queryClient]);

  const openConfirmationModal = () => {
    const nextFieldErrors: WorkflowFieldErrors = {};

    if (!isValidGramsInput(amountGrams)) {
      nextFieldErrors.amountGrams = "Enter a valid gold amount in grams greater than zero.";
    }

    if (!deliveryZoneId) {
      nextFieldErrors.deliveryZoneId = "Select a delivery zone.";
    }

    if (!deliveryAddress.trim()) {
      nextFieldErrors.deliveryAddress = "Enter the delivery address.";
    }

    if (!recipientName.trim()) {
      nextFieldErrors.recipientName = "Enter the recipient name.";
    }

    if (!recipientPhone.trim()) {
      nextFieldErrors.recipientPhone = "Enter the recipient phone number.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setActionError(null);
      return;
    }

    setFieldErrors({});
    setActionError(null);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmationModal = () => {
    if (requestDeliveryMutation.isPending) {
      return;
    }

    setIsConfirmModalOpen(false);
  };

  const submitDeliveryRequest = async () => {
    if (
      !isValidGramsInput(amountGrams) ||
      !deliveryZoneId ||
      !deliveryAddress.trim() ||
      !recipientName.trim() ||
      !recipientPhone.trim()
    ) {
      return;
    }

    setActionError(null);
    idempotencyKeyRef.current = resolveIdempotencyKey(idempotencyKeyRef.current, createIdempotencyKey);

    try {
      const request = await requestDeliveryMutation.mutateAsync({
        amount: gramsInputToMilligrams(amountGrams),
        asset_code: XAU_ASSET_CODE,
        delivery_address: deliveryAddress.trim(),
        delivery_zone_id: deliveryZoneId,
        idempotency_key: idempotencyKeyRef.current,
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
      });

      setLatestRequestId(request.id);
      setSessionRequestIds(rememberDeliverySessionId(request.id));
      idempotencyKeyRef.current = idempotencyKeyAfterSuccessfulMutation();
      setIsConfirmModalOpen(false);
      void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
      router.push(`/delivery/${request.id}`);
    } catch (error) {
      setActionError(toNormalizedApiError(error));
      setIsConfirmModalOpen(false);
    }
  };

  const cancelLatestRequest = async () => {
    if (!latestRequestId) {
      return;
    }

    setActionError(null);

    try {
      await cancelDeliveryMutation.mutateAsync(latestRequestId);
      void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  };

  return {
    amountGrams,
    setAmountGrams,
    deliveryAddress,
    setDeliveryAddress,
    recipientName,
    setRecipientName,
    recipientPhone,
    setRecipientPhone,
    deliveryZoneId,
    setDeliveryZoneId,
    sessionRequestIds,
    eligibility,
    walletLoading: walletQuery.isLoading,
    walletError: walletQuery.isError,
    zones: zonesQuery.data ?? [],
    zonesLoading: zonesQuery.isLoading,
    zonesError: zonesQuery.isError,
    latestRequestView,
    selectedZone,
    actionError,
    fieldErrors,
    isConfirmModalOpen,
    pendingAmountMg,
    isSubmitting: requestDeliveryMutation.isPending,
    isPolling: latestRequestQuery.isFetching && Boolean(latestRequestId),
    isCancelling: cancelDeliveryMutation.isPending,
    openConfirmationModal,
    closeConfirmationModal,
    submitDeliveryRequest,
    cancelLatestRequest,
  };
}

export function useDeliveryDetailWorkflow(requestId: string) {
  const queryClient = useQueryClient();
  const walletInvalidatedRef = useRef(false);

  const [actionError, setActionError] = useState<ReturnType<typeof toNormalizedApiError>>(null);
  const requestQuery = useDeliveryRequest(requestId, Boolean(requestId));
  const zonesQuery = useDeliveryZones();
  const cancelDeliveryMutation = useCancelDeliveryRequest();

  const requestView = useMemo(
    () => (requestQuery.data ? mapDeliveryRequestToStatusView(requestQuery.data) : null),
    [requestQuery.data],
  );

  const zoneLabel = useMemo(() => {
    if (!requestQuery.data) {
      return null;
    }

    const zone = (zonesQuery.data ?? []).find((item) => item.id === requestQuery.data?.delivery_zone_id);
    return zone ? `${zone.name} (${zone.city})` : requestQuery.data.delivery_zone_id;
  }, [requestQuery.data, zonesQuery.data]);

  useEffect(() => {
    const request = requestQuery.data;
    if (
      !request ||
      !isSuccessfulDeliveryStatus(request.status) ||
      walletInvalidatedRef.current
    ) {
      return;
    }

    walletInvalidatedRef.current = true;
    void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
  }, [queryClient, requestQuery.data]);

  const cancelRequest = async () => {
    setActionError(null);

    try {
      await cancelDeliveryMutation.mutateAsync(requestId);
      void queryClient.invalidateQueries({ queryKey: walletQueryKeys.myAccounts() });
    } catch (error) {
      setActionError(toNormalizedApiError(error));
    }
  };

  return {
    requestView,
    zoneLabel,
    actionError,
    isLoading: requestQuery.isLoading,
    isError: requestQuery.isError,
    isPolling: requestQuery.isFetching,
    isCancelling: cancelDeliveryMutation.isPending,
    cancelRequest,
  };
}
