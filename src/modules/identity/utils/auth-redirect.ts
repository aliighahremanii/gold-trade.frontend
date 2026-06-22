import type { components as IdentityComponents } from "@/generated/api/identity";

type AuthTokensResponse = IdentityComponents["schemas"]["AuthTokensResponse"];

export function resolvePostAuthPath(
  tokens: Pick<AuthTokensResponse, "requiresTotp" | "isEmailVerified" | "isMobileVerified">,
  nextPath = "/dashboard",
) {
  const next = encodeURIComponent(nextPath);

  if (tokens.requiresTotp) {
    return `/verify?purpose=totp&next=${next}`;
  }

  if (!tokens.isMobileVerified) {
    return `/verify?channel=sms&purpose=mobile_verification&next=${next}`;
  }

  if (!tokens.isEmailVerified) {
    return `/verify?channel=email&purpose=email_verification&next=${next}`;
  }

  return nextPath;
}

export function sanitizeNextPath(nextPath?: string) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}
