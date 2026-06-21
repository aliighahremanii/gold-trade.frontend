import { ScaffoldPage } from "@/shared/layout/scaffold-page";

type SignInScaffoldFlowProps = {
  nextPath?: string;
  reason?: string;
};

const reasonCopy: Record<string, string> = {
  admin_required: "Administrator access is required to open that route.",
  auth_required: "Sign in is required before you can continue.",
};

function getDescription(nextPath?: string, reason?: string) {
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

export function SignInScaffoldFlow({ nextPath, reason }: SignInScaffoldFlowProps) {
  return (
    <ScaffoldPage
      title="Sign in"
      module="identity"
      description={getDescription(nextPath, reason)}
    />
  );
}