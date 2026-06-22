import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { components as IdentityComponents, paths as IdentityPaths } from "@/generated/api/identity";

import { postAuthRoute } from "./auth-request";
import { identityQueryKeys } from "./query-keys";
import { getDeviceContext } from "../utils/device";

type SignUpRequest = IdentityComponents["schemas"]["SignUpRequest"];
type AuthTokensResponse = IdentityPaths["/auth/sign-up"]["post"]["responses"][200]["content"]["application/json"];

export async function signUp(
  input: Pick<SignUpRequest, "email" | "password" | "mobileNumber" | "nationalCode">,
) {
  return postAuthRoute<AuthTokensResponse>("/api/auth/sign-up", {
    ...input,
    ...getDeviceContext(),
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: identityQueryKeys.currentUser() });
    },
  });
}
