"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { isNormalizedApiError } from "@/modules/identity/api/auth-request";
import { useCurrentUser } from "@/modules/identity/api/use-current-user";
import { useSendOtp } from "@/modules/identity/api/use-send-otp";
import { useVerifyOtp } from "@/modules/identity/api/use-verify-otp";
import { AuthErrorAlert } from "@/modules/identity/components/auth-error-alert";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { sanitizeNextPath } from "@/modules/identity/utils/auth-redirect";

type VerifyOtpFlowProps = {
  channel?: string;
  purpose?: string;
  nextPath?: string;
};

type VerificationStep = "idle" | "challenge_sent" | "expired" | "verified";

export function isOtpChallengeExpired(expiresAt: string | null, now = Date.now()) {
  if (!expiresAt) {
    return false;
  }

  return Date.parse(expiresAt) <= now;
}

export function VerifyOtpFlow({ channel, purpose, nextPath }: VerifyOtpFlowProps) {
  const router = useRouter();
  const currentUserQuery = useCurrentUser();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<VerificationStep>("idle");
  const destinationPath = sanitizeNextPath(nextPath);

  const resolvedChannel = channel ?? "sms";
  const resolvedPurpose = purpose ?? "verification";

  const sendError = isNormalizedApiError(sendOtpMutation.error) ? sendOtpMutation.error : null;
  const verifyError = isNormalizedApiError(verifyOtpMutation.error) ? verifyOtpMutation.error : null;
  const activeError = verifyError ?? sendError;
  const isRateLimited = activeError?.kind === "rate_limited";
  const isExpired = step === "expired" || isOtpChallengeExpired(expiresAt);

  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setStep("expired");
    }, Math.max(0, Date.parse(expiresAt) - Date.now()) + 25);

    return () => window.clearTimeout(timeoutId);
  }, [expiresAt]);

  const verificationSummary = useMemo(() => {
    if (!currentUserQuery.data) {
      return "Complete verification to continue.";
    }

    const pending: string[] = [];

    if (!currentUserQuery.data.isMobileVerified) {
      pending.push("mobile");
    }

    if (!currentUserQuery.data.isEmailVerified) {
      pending.push("email");
    }

    if (pending.length === 0) {
      return "Your account is verified.";
    }

    return `Verification pending for: ${pending.join(", ")}.`;
  }, [currentUserQuery.data]);

  async function handleSendCode() {
    try {
      const challenge = await sendOtpMutation.mutateAsync({
        channel: resolvedChannel,
        purpose: resolvedPurpose,
      });
      setChallengeId(challenge.challengeId);
      setDestination(challenge.destination);
      setExpiresAt(challenge.expiresAt);
      setCode("");
      setStep("challenge_sent");
    } catch {
      // Error state is rendered from the mutation result.
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!challengeId || isExpired) {
      if (isExpired) {
        setStep("expired");
      }
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ challengeId, code });
      setStep("verified");
      router.push(destinationPath);
      router.refresh();
    } catch {
      // Error state is rendered from the mutation result.
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">identity</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Verify account</h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">{verificationSummary}</p>
      </div>

      {currentUserQuery.isLoading ? (
        <p className="text-sm text-zinc-500" aria-live="polite">
          Loading session...
        </p>
      ) : null}

      {currentUserQuery.isError ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <p>Sign in is required before verification can continue.</p>
          <Link href="/sign-in" className="mt-2 inline-block font-medium underline">
            Go to sign in
          </Link>
        </div>
      ) : null}

      {currentUserQuery.data ? (
        <>
          <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <p>
              Channel: <span className="font-medium">{resolvedChannel}</span>
            </p>
            <p>
              Purpose: <span className="font-medium">{resolvedPurpose}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleSendCode}
            disabled={sendOtpMutation.isPending}
            className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            {sendOtpMutation.isPending ? "Sending code..." : "Send verification code"}
          </button>

          {isRateLimited ? (
            <p className="text-sm text-amber-700 dark:text-amber-300" aria-live="polite">
              Too many verification attempts. Wait before requesting another code.
            </p>
          ) : null}

          {step === "challenge_sent" && destination ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Code sent to {destination}
              {expiresAt ? ` · expires ${new Date(expiresAt).toLocaleString()}` : null}
            </p>
          ) : null}

          {step === "expired" || isExpired ? (
            <p className="text-sm text-amber-700 dark:text-amber-300" aria-live="polite">
              This verification code has expired. Request a new code to continue.
            </p>
          ) : null}

          <form className="flex flex-col gap-4" onSubmit={handleVerify}>
            <AuthFormField
              id="verify-otp-code"
              label="Verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
              disabled={!challengeId || isExpired}
            />

            <AuthErrorAlert error={activeError} />

            <button
              type="submit"
              disabled={!challengeId || isExpired || verifyOtpMutation.isPending}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {verifyOtpMutation.isPending
                ? "Verifying..."
                : isExpired
                  ? "Code expired"
                  : "Verify code"}
            </button>
          </form>
        </>
      ) : null}
    </section>
  );
}
