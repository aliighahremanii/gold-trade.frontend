import { VerifyOtpFlow } from "@/modules/identity/flows/verify-otp-flow";
import { VerifyTotpFlow } from "@/modules/identity/flows/verify-totp-flow";
import { isTotpVerificationPurpose } from "@/modules/identity/utils/verification-redirect";

type VerifyFlowProps = {
  channel?: string;
  purpose?: string;
  nextPath?: string;
};

export function VerifyFlow({ channel, purpose, nextPath }: VerifyFlowProps) {
  if (isTotpVerificationPurpose(purpose)) {
    return <VerifyTotpFlow nextPath={nextPath} />;
  }

  return <VerifyOtpFlow channel={channel} purpose={purpose} nextPath={nextPath} />;
}
