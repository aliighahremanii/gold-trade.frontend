"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { isNormalizedApiError } from "@/modules/identity/api/auth-request";
import { useCurrentUser } from "@/modules/identity/api/use-current-user";
import { useSendOtp } from "@/modules/identity/api/use-send-otp";
import { useVerifyOtp } from "@/modules/identity/api/use-verify-otp";
import { AuthErrorAlert } from "@/modules/identity/components/auth-error-alert";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { useRateLimitCooldown } from "@/modules/identity/hooks/use-rate-limit-cooldown";
import { isEmailVerificationRequired, shouldPromptForEmailVerification } from "@/modules/identity/config/verification-requirements";
import { sanitizeNextPath } from "@/modules/identity/utils/auth-redirect";
import {
  OTP_CHANNEL,
  normalizeOtpChannel,
  normalizeOtpPurpose,
} from "@/modules/identity/utils/otp-contract";
import {
  clearStoredOtpChallenge,
  markAutoSendAttempt,
  readStoredOtpChallenge,
  shouldSkipAutoSend,
  writeStoredOtpChallenge,
} from "@/modules/identity/utils/otp-challenge-storage";
import { getOtpErrorGuidance } from "@/modules/identity/utils/otp-error-guidance";
import {
  readMobileVerificationAck,
  writeMobileVerificationAck,
} from "@/modules/identity/utils/mobile-verification-ack-storage";
import {
  getOtpChallengeTimeRemainingMs,
  isOtpChallengeExpired,
  isValidOtpCode,
  maskEmail,
  maskPhoneNumber,
  resolveOtpExpiresAt,
  sanitizeOtpCodeInput,
} from "@/modules/identity/utils/otp-utils";
import {
  buildVerifySignInHref,
  getNextVerificationStepPath,
  getVerifiedChannelRedirectPath,
} from "@/modules/identity/utils/verification-redirect";

type VerifyOtpFlowProps = {
  channel?: string;
  purpose?: string;
  nextPath?: string;
};

type VerificationStep = "idle" | "challenge_sent" | "expired" | "verified";

type InitialChallengeState = {
  challengeId: string | null;
  destination: string | null;
  expiresAt: string | null;
  step: VerificationStep;
};

function getInitialChallengeState(channel: string, purpose: string): InitialChallengeState {
  const stored = readStoredOtpChallenge(channel, purpose);

  if (!stored) {
    return {
      challengeId: null,
      destination: null,
      expiresAt: null,
      step: "idle",
    };
  }

  return {
    challengeId: stored.challengeId,
    destination: stored.destination,
    expiresAt: stored.expiresAt,
    step: "challenge_sent",
  };
}

function getVerificationStepCopy(
  channel: string,
  user: { mobileNumber: string; email: string; isMobileVerified: boolean; isEmailVerified: boolean },
) {
  const pendingSteps: string[] = [];

  if (!user.isMobileVerified) {
    pendingSteps.push("mobile number");
  }

  if (isEmailVerificationRequired() && !user.isEmailVerified) {
    pendingSteps.push("email address");
  }

  if (pendingSteps.length === 0) {
    if (channel === OTP_CHANNEL.email && shouldPromptForEmailVerification() && !user.isEmailVerified) {
      return "Verify your email address when you are ready. You can skip this step for now.";
    }

    return "Your account is verified.";
  }

  const currentStep =
    channel === OTP_CHANNEL.email
      ? isEmailVerificationRequired()
        ? "Verify your email address to continue."
        : "Verify your email address when you are ready. You can skip this step for now."
      : shouldPromptForEmailVerification() && !user.isEmailVerified
        ? "Verify your mobile number to continue. Email verification is optional in the next step."
        : "Verify your mobile number to continue.";

  if (pendingSteps.length > 1) {
    return `${currentStep} You will verify your ${pendingSteps.join(" and ")} in separate steps.`;
  }

  return currentStep;
}

function hasMobileVerificationAckForUser(userId?: string) {
  return Boolean(userId && readMobileVerificationAck(userId));
}

export function VerifyOtpFlow({ channel, purpose, nextPath }: VerifyOtpFlowProps) {
  const router = useRouter();
  const currentUserQuery = useCurrentUser();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const sendGenerationRef = useRef(0);
  const destinationPath = sanitizeNextPath(nextPath);
  const resolvedChannel = normalizeOtpChannel(channel);
  const resolvedPurpose = normalizeOtpPurpose(purpose, resolvedChannel);
  const initialChallengeState = getInitialChallengeState(resolvedChannel, resolvedPurpose);
  const [challengeId, setChallengeId] = useState<string | null>(initialChallengeState.challengeId);
  const [destination, setDestination] = useState<string | null>(initialChallengeState.destination);
  const [expiresAt, setExpiresAt] = useState<string | null>(initialChallengeState.expiresAt);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<VerificationStep>(initialChallengeState.step);
  const [isContinuing, setIsContinuing] = useState(false);

  const sendError = isNormalizedApiError(sendOtpMutation.error) ? sendOtpMutation.error : null;
  const verifyError = isNormalizedApiError(verifyOtpMutation.error) ? verifyOtpMutation.error : null;
  const sendCooldown = useRateLimitCooldown(sendError);
  const isExpired =
    !sendOtpMutation.isPending &&
    (step === "expired" || isOtpChallengeExpired(expiresAt));
  const trimmedCode = code.trim();
  const canVerify =
    Boolean(challengeId) &&
    !isExpired &&
    isValidOtpCode(trimmedCode) &&
    !verifyOtpMutation.isPending;

  const signInHref = buildVerifySignInHref({
    channel: resolvedChannel,
    purpose: resolvedPurpose,
    nextPath: destinationPath,
  });

  useEffect(() => {
    if (!currentUserQuery.data || isContinuing) {
      return;
    }

    const redirectPath = getVerifiedChannelRedirectPath(
      currentUserQuery.data,
      resolvedChannel,
      destinationPath,
      {
        mobileVerificationAcknowledged: hasMobileVerificationAckForUser(
          currentUserQuery.data.userId,
        ),
      },
    );

    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [currentUserQuery.data, destinationPath, isContinuing, resolvedChannel, router]);

  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const remainingMs = getOtpChallengeTimeRemainingMs(expiresAt);

    if (remainingMs === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setStep("expired");
    }, remainingMs + 25);

    return () => window.clearTimeout(timeoutId);
  }, [expiresAt]);

  const verificationSummary = useMemo(() => {
    if (!currentUserQuery.data) {
      return "Complete verification to continue.";
    }

    return getVerificationStepCopy(resolvedChannel, currentUserQuery.data);
  }, [currentUserQuery.data, resolvedChannel]);

  const destinationPreview = useMemo(() => {
    if (!currentUserQuery.data) {
      return null;
    }

    if (resolvedChannel === OTP_CHANNEL.email) {
      return maskEmail(currentUserQuery.data.email);
    }

    return maskPhoneNumber(currentUserQuery.data.mobileNumber);
  }, [currentUserQuery.data, resolvedChannel]);

  function applyChallenge(challenge: {
    challengeId: string;
    destination: string;
    expiresAt: string;
  }) {
    const normalizedChallenge = {
      ...challenge,
      expiresAt: resolveOtpExpiresAt(challenge.expiresAt),
      sentAt: new Date().toISOString(),
    };

    setChallengeId(normalizedChallenge.challengeId);
    setDestination(normalizedChallenge.destination);
    setExpiresAt(normalizedChallenge.expiresAt);
    setCode("");
    setStep("challenge_sent");
    writeStoredOtpChallenge(resolvedChannel, resolvedPurpose, normalizedChallenge);
  }

  async function handleSendCode() {
    if (sendCooldown.isCoolingDown || sendOtpMutation.isPending) {
      return;
    }

    markAutoSendAttempt(resolvedChannel, resolvedPurpose);
    const generation = ++sendGenerationRef.current;

    verifyOtpMutation.reset();
    sendOtpMutation.reset();
    setStep("idle");
    setChallengeId(null);
    setDestination(null);
    setExpiresAt(null);
    clearStoredOtpChallenge(resolvedChannel, resolvedPurpose);

    try {
      const challenge = await sendOtpMutation.mutateAsync({
        channel: resolvedChannel,
        purpose: resolvedPurpose,
      });

      if (generation !== sendGenerationRef.current) {
        return;
      }

      applyChallenge(challenge);
    } catch {
      if (generation !== sendGenerationRef.current) {
        return;
      }

      setChallengeId(null);
      setDestination(null);
      setExpiresAt(null);
      setStep("idle");
      clearStoredOtpChallenge(resolvedChannel, resolvedPurpose);
    }
  }

  const handleSendCodeRef = useRef(handleSendCode);

  useEffect(() => {
    handleSendCodeRef.current = handleSendCode;
  });

  useEffect(() => {
    if (!currentUserQuery.data || challengeId) {
      return;
    }

    if (
      getVerifiedChannelRedirectPath(currentUserQuery.data, resolvedChannel, destinationPath, {
        mobileVerificationAcknowledged: hasMobileVerificationAckForUser(
          currentUserQuery.data.userId,
        ),
      })
    ) {
      return;
    }

    if (shouldSkipAutoSend(resolvedChannel, resolvedPurpose)) {
      return;
    }

    void handleSendCodeRef.current();
  }, [challengeId, currentUserQuery.data, destinationPath, resolvedChannel, resolvedPurpose]);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canVerify || !challengeId) {
      if (isExpired) {
        setStep("expired");
      }
      return;
    }

    try {
      setIsContinuing(true);
      const userId = currentUserQuery.data?.userId;

      await verifyOtpMutation.mutateAsync({
        challengeId,
        code: trimmedCode,
        ackChannel: resolvedChannel,
        ackUserId: userId,
      });

      if (resolvedChannel === OTP_CHANNEL.sms && userId) {
        writeMobileVerificationAck(userId);
      }

      clearStoredOtpChallenge(resolvedChannel, resolvedPurpose);
      setChallengeId(null);
      setDestination(null);
      setExpiresAt(null);
      setStep("verified");

      const refreshedUser = await currentUserQuery.refetch();
      const user = refreshedUser.data ?? currentUserQuery.data;
      const effectiveUser = user
        ? {
            ...user,
            isMobileVerified:
              user.isMobileVerified || hasMobileVerificationAckForUser(user.userId),
          }
        : null;
      const nextRoute = effectiveUser
        ? getNextVerificationStepPath(effectiveUser, destinationPath)
        : destinationPath;

      router.push(nextRoute);
      router.refresh();
    } catch {
      setIsContinuing(false);
      // Error state is rendered from the mutation result.
    }
  }

  function handleSkipEmail() {
    router.push(destinationPath);
    router.refresh();
  }

  const sendButtonLabel = sendOtpMutation.isPending
    ? "Sending code..."
    : step === "challenge_sent"
      ? "Resend verification code"
      : "Send verification code";

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">identity</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Verify account</h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">{verificationSummary}</p>
      </div>

      {currentUserQuery.isLoading ? (
        <p className="text-sm text-zinc-500" aria-live="polite">
          Preparing verification...
        </p>
      ) : null}

      {currentUserQuery.isError ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <p>Sign in is required before verification can continue.</p>
          <Link href={signInHref} className="mt-2 inline-block font-medium underline">
            Go to sign in
          </Link>
        </div>
      ) : null}

      {isContinuing ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
          Verification successful. Continuing...
        </p>
      ) : null}

      {currentUserQuery.data ? (
        <>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <p>
              {resolvedChannel === OTP_CHANNEL.email
                ? "We will email a verification code to"
                : "We will text a verification code to"}{" "}
              <span className="font-medium">{destinationPreview}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleSendCode()}
            disabled={sendOtpMutation.isPending || sendCooldown.isCoolingDown}
            className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            {sendCooldown.isCoolingDown
              ? `Resend available in ${sendCooldown.secondsRemaining}s`
              : sendButtonLabel}
          </button>

          {sendError ? (
            <AuthErrorAlert
              error={sendError}
              guidance={getOtpErrorGuidance(sendError, "send")}
              variant={sendError.kind === "rate_limited" ? "warning" : "error"}
            />
          ) : null}

          {step === "challenge_sent" && destination ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Code sent to {destination}
              {expiresAt ? ` · expires ${new Date(expiresAt).toLocaleString()}` : null}
              <span className="mt-1 block">
                Enter the code from your most recent message. Requesting a new code invalidates earlier
                ones.
              </span>
            </p>
          ) : null}

          {!sendError && step === "idle" && sendOtpMutation.isPending ? (
            <p className="text-sm text-zinc-500" aria-live="polite">
              Sending your verification code...
            </p>
          ) : null}

          {isExpired ? (
            <p className="text-sm text-amber-700 dark:text-amber-300" aria-live="polite">
              This verification code has expired. Request a new code to continue.
            </p>
          ) : null}

          {!challengeId && !sendOtpMutation.isPending && !sendError ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Enter the code after it arrives. If nothing arrives, use resend once the cooldown ends.
            </p>
          ) : null}

          <form className="flex flex-col gap-4" onSubmit={handleVerify}>
            <AuthFormField
              id="verify-otp-code"
              label="Verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={8}
              value={code}
              onChange={(event) => setCode(sanitizeOtpCodeInput(event.target.value))}
              required
              disabled={!challengeId || isExpired}
            />

            {verifyError ? (
              <AuthErrorAlert
                error={verifyError}
                guidance={getOtpErrorGuidance(verifyError, "verify")}
              />
            ) : null}

            {!challengeId && !sendOtpMutation.isPending ? (
              <p className="text-sm text-zinc-500">
                The code field unlocks after a verification code is sent.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!canVerify}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {verifyOtpMutation.isPending
                ? "Verifying..."
                : isExpired
                  ? "Code expired"
                  : "Verify code"}
            </button>
          </form>

          {!isEmailVerificationRequired() && resolvedChannel === OTP_CHANNEL.email ? (
            <button
              type="button"
              onClick={handleSkipEmail}
              className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Skip for now
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
