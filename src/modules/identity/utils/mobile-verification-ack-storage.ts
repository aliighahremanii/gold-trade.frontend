const MOBILE_VERIFICATION_ACK_USER_KEY = "gt_mobile_verified_ack_user";

export function writeMobileVerificationAck(userId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(MOBILE_VERIFICATION_ACK_USER_KEY, userId);
}

export function readMobileVerificationAck(userId: string) {
  if (typeof window === "undefined" || !userId) {
    return false;
  }

  return window.sessionStorage.getItem(MOBILE_VERIFICATION_ACK_USER_KEY) === userId;
}

export function clearMobileVerificationAck() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(MOBILE_VERIFICATION_ACK_USER_KEY);
}
