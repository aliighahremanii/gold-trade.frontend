import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { getPendingVerificationPath } from "@/modules/identity/utils/verification-redirect";
import {
  getRequestedDestination,
  requireAuthenticatedSession,
} from "@/shared/auth/session-guard";
import { hasMobileVerificationAck } from "@/shared/auth/verification-ack-cookie";

export async function requireVerifiedCustomerSession(fallbackPath = "/dashboard") {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const destination = getRequestedDestination(headerStore, fallbackPath);
  const currentUser = await requireAuthenticatedSession(destination);
  const userForVerification = {
    ...currentUser,
    isMobileVerified:
      currentUser.isMobileVerified || hasMobileVerificationAck(cookieStore, currentUser.userId),
  };
  const pendingVerificationPath = getPendingVerificationPath(userForVerification, destination);

  if (pendingVerificationPath) {
    redirect(pendingVerificationPath);
  }

  return currentUser;
}
