import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postAuthRoute } from "./auth-request";
import { identityQueryKeys } from "./query-keys";

export async function signOut() {
  return postAuthRoute<void>("/api/auth/sign-out");
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: async () => {
      await queryClient.removeQueries({ queryKey: identityQueryKeys.currentUser() });
    },
  });
}
