import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { components as IdentityComponents, paths as IdentityPaths } from "@/generated/api/identity";

import { postAuthRoute } from "./auth-request";
import { identityQueryKeys } from "./query-keys";
import { getDeviceContext } from "../utils/device";

type SignInRequest = IdentityComponents["schemas"]["SignInRequest"];
type AuthTokensResponse = IdentityPaths["/auth/sign-in"]["post"]["responses"][200]["content"]["application/json"];

export async function signIn(input: Pick<SignInRequest, "email" | "password">) {
  return postAuthRoute<AuthTokensResponse>("/api/auth/sign-in", {
    ...input,
    ...getDeviceContext(),
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: identityQueryKeys.currentUser() });
    },
  });
}
