import type { components as IdentityComponents } from "@/generated/api/identity";

import { getNextVerificationStepPath } from "@/modules/identity/utils/verification-redirect";

type AuthTokensResponse = IdentityComponents["schemas"]["AuthTokensResponse"];

export function resolvePostAuthPath(
  tokens: Pick<AuthTokensResponse, "requiresTotp" | "isEmailVerified" | "isMobileVerified">,
  nextPath = "/dashboard",
) {
  if (tokens.requiresTotp) {
    return `/verify?purpose=totp&next=${encodeURIComponent(nextPath)}`;
  }

  return getNextVerificationStepPath(tokens, nextPath);
}

export function sanitizeNextPath(nextPath?: string) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}
