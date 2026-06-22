import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { components as IdentityComponents } from "@/generated/api/identity";
import { unwrapApiMutation } from "@/shared/api";

import { identityClient } from "./client";
import { identityQueryKeys } from "./query-keys";

type VerifyTotpRequest = IdentityComponents["schemas"]["VerifyTotpRequest"];
type IdentityProblemResponse = IdentityComponents["schemas"]["ProblemResponse"];

export async function confirmTotpEnrollment(input: VerifyTotpRequest) {
  const result = await identityClient.POST("/totp/verify", {
    body: input,
  });

  return unwrapApiMutation<void, IdentityProblemResponse>(
    result,
    "Unable to verify the authenticator code.",
  );
}

export function useConfirmTotp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmTotpEnrollment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: identityQueryKeys.currentUser() });
    },
  });
}
