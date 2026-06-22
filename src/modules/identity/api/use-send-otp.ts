import { useMutation } from "@tanstack/react-query";

import type { components as IdentityComponents, paths as IdentityPaths } from "@/generated/api/identity";
import { unwrapApiResponse } from "@/shared/api";

import { identityClient } from "./client";

type SendOtpRequest = IdentityComponents["schemas"]["SendOtpRequest"];
type OtpChallengeResponse =
  IdentityPaths["/verification/otp/send"]["post"]["responses"][200]["content"]["application/json"];
type IdentityProblemResponse = IdentityComponents["schemas"]["ProblemResponse"];

export async function sendOtp(input: SendOtpRequest) {
  const result = await identityClient.POST("/verification/otp/send", {
    body: input,
  });

  return unwrapApiResponse<OtpChallengeResponse, IdentityProblemResponse>(
    result,
    "Unable to send the verification code.",
  );
}

export function useSendOtp() {
  return useMutation({
    mutationFn: sendOtp,
  });
}
