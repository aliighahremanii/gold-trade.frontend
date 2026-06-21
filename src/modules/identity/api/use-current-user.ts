import { useQuery } from "@tanstack/react-query";

import type { components as IdentityComponents, paths as IdentityPaths } from "@/generated/api/identity";
import { unwrapApiResponse } from "@/shared/api";

import { identityClient } from "./client";
import { identityQueryKeys } from "./query-keys";

type CurrentUserResponse = IdentityPaths["/me"]["get"]["responses"][200]["content"]["application/json"];
type IdentityProblemResponse = IdentityComponents["schemas"]["ProblemResponse"];

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const result = await identityClient.GET("/me");

  return unwrapApiResponse<CurrentUserResponse, IdentityProblemResponse>(
    result,
    "Unable to load the current user.",
  );
}

export function useCurrentUser() {
  return useQuery({
    queryKey: identityQueryKeys.currentUser(),
    queryFn: getCurrentUser,
  });
}