import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { components as IdentityComponents } from "@/generated/api/identity";
import { unwrapApiMutation } from "@/shared/api";

import { identityClient } from "./client";
import { identityQueryKeys } from "./query-keys";

type VerifyOtpRequest = IdentityComponents["schemas"]["VerifyOtpRequest"];
type IdentityProblemResponse = IdentityComponents["schemas"]["ProblemResponse"];

export type VerifyOtpInput = VerifyOtpRequest & {
  ackChannel?: string;
  ackUserId?: string;
};

export async function verifyOtp(input: VerifyOtpInput) {
  const { ackChannel, ackUserId, ...body } = input;
  const query = new URLSearchParams();

  if (ackChannel) {
    query.set("ackChannel", ackChannel);
  }

  if (ackUserId) {
    query.set("ackUserId", ackUserId);
  }

  const queryString = query.size > 0 ? `?${query.toString()}` : "";

  const result = await identityClient.POST(`/verification/otp/verify${queryString}` as "/verification/otp/verify", {
    body,
  });

  return unwrapApiMutation<void, IdentityProblemResponse>(
    result,
    "Unable to verify the OTP code.",
  );
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: identityQueryKeys.currentUser() });
    },
  });
}
