import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { components as IdentityComponents } from "@/generated/api/identity";
import { unwrapApiMutation } from "@/shared/api";

import { identityClient } from "./client";
import { identityQueryKeys } from "./query-keys";

type VerifyOtpRequest = IdentityComponents["schemas"]["VerifyOtpRequest"];
type IdentityProblemResponse = IdentityComponents["schemas"]["ProblemResponse"];

export async function verifyOtp(input: VerifyOtpRequest) {
  const result = await identityClient.POST("/verification/otp/verify", {
    body: input,
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
