const reasonCopy: Record<string, string> = {
  admin_required: "Administrator access is required to open that route.",
  auth_required: "Sign in is required before you can continue.",
  signed_out: "You have signed out of this browser session.",
  sign_out_failed:
    "The browser session was cleared, but the server could not confirm session revocation.",
};

export function getSignInDescription(nextPath?: string, reason?: string) {
  const baseMessage = reason ? reasonCopy[reason] : undefined;

  if (!baseMessage && !nextPath) {
    return undefined;
  }

  if (!nextPath) {
    return baseMessage;
  }

  if (!baseMessage) {
    return `After sign-in, continue to ${nextPath}.`;
  }

  return `${baseMessage} After sign-in, continue to ${nextPath}.`;
}
