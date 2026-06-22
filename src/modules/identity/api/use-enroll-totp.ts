import { useMutation } from "@tanstack/react-query";

import type { components as IdentityComponents, paths as IdentityPaths } from "@/generated/api/identity";
import { unwrapApiResponse } from "@/shared/api";

import { identityClient } from "./client";

type TotpEnrollmentResponse =
  IdentityPaths["/totp/enroll"]["post"]["responses"][200]["content"]["application/json"];
type IdentityProblemResponse = IdentityComponents["schemas"]["ProblemResponse"];

export async function enrollTotp() {
  const result = await identityClient.POST("/totp/enroll");

  return unwrapApiResponse<TotpEnrollmentResponse, IdentityProblemResponse>(
    result,
    "Unable to start TOTP enrollment.",
  );
}

export function useEnrollTotp() {
  return useMutation({
    mutationFn: enrollTotp,
  });
}
