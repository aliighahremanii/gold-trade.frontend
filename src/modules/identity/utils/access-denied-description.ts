const reasonCopy: Record<string, string> = {
  admin_required: "Your account is signed in, but it does not have administrator access.",
};

export function getAccessDeniedDescription(reason?: string, nextPath?: string) {
  const baseMessage = reason ? reasonCopy[reason] : "You do not have access to that route.";

  if (!nextPath) {
    return baseMessage;
  }

  return `${baseMessage} The requested route was ${nextPath}.`;
}
