const MOBILE_VERIFICATION_ACK_KEY = "gt_mobile_verified_ack";

export function writeMobileVerificationAck() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(MOBILE_VERIFICATION_ACK_KEY, "1");
}

export function readMobileVerificationAck() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(MOBILE_VERIFICATION_ACK_KEY) === "1";
}

export function clearMobileVerificationAck() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(MOBILE_VERIFICATION_ACK_KEY);
}
