"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { isNormalizedApiError } from "@/modules/identity/api/auth-request";
import { useConfirmTotp } from "@/modules/identity/api/use-confirm-totp";
import { useCurrentUser } from "@/modules/identity/api/use-current-user";
import { useEnrollTotp } from "@/modules/identity/api/use-enroll-totp";
import { AuthErrorAlert } from "@/modules/identity/components/auth-error-alert";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { useRateLimitCooldown } from "@/modules/identity/hooks/use-rate-limit-cooldown";
import { sanitizeNextPath } from "@/modules/identity/utils/auth-redirect";
import { isValidOtpCode, sanitizeOtpCodeInput } from "@/modules/identity/utils/otp-utils";
import {
  buildVerifySignInHref,
  resolvePostVerificationPath,
} from "@/modules/identity/utils/verification-redirect";

type VerifyTotpFlowProps = {
  nextPath?: string;
};

export function VerifyTotpFlow({ nextPath }: VerifyTotpFlowProps) {
  const router = useRouter();
  const currentUserQuery = useCurrentUser();
  const enrollTotpMutation = useEnrollTotp();
  const confirmTotpMutation = useConfirmTotp();
  const enrollAttemptedRef = useRef(false);
  const [manualEntryKey, setManualEntryKey] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const destinationPath = sanitizeNextPath(nextPath);
  const trimmedCode = code.trim();

  const enrollError = isNormalizedApiError(enrollTotpMutation.error) ? enrollTotpMutation.error : null;
  const confirmError = isNormalizedApiError(confirmTotpMutation.error)
    ? confirmTotpMutation.error
    : null;
  const enrollCooldown = useRateLimitCooldown(enrollError);
  const confirmCooldown = useRateLimitCooldown(confirmError);

  const signInHref = buildVerifySignInHref({
    purpose: "totp",
    nextPath: destinationPath,
  });

  useEffect(() => {
    if (!currentUserQuery.data || enrollAttemptedRef.current || manualEntryKey) {
      return;
    }

    enrollAttemptedRef.current = true;

    void enrollTotpMutation
      .mutateAsync()
      .then((enrollment) => {
        setManualEntryKey(enrollment.manualEntryKey);
      })
      .catch(() => {
        enrollAttemptedRef.current = false;
      });
  }, [currentUserQuery.data, enrollTotpMutation, manualEntryKey]);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidOtpCode(trimmedCode) || confirmTotpMutation.isPending || confirmCooldown.isCoolingDown) {
      return;
    }

    try {
      await confirmTotpMutation.mutateAsync({ code: trimmedCode });
      const refreshedUser = await currentUserQuery.refetch();

      if (refreshedUser.data) {
        router.push(resolvePostVerificationPath(refreshedUser.data, destinationPath));
      } else {
        router.push(destinationPath);
      }

      router.refresh();
    } catch {
      // Error state is rendered from the mutation result.
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">identity</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Set up authenticator
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Add this account to your authenticator app, then enter the 6-digit code to continue.
        </p>
      </div>

      {currentUserQuery.isLoading ? (
        <p className="text-sm text-zinc-500" aria-live="polite">
          Preparing authenticator setup...
        </p>
      ) : null}

      {currentUserQuery.isError ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <p>Sign in is required before authenticator setup can continue.</p>
          <Link href={signInHref} className="mt-2 inline-block font-medium underline">
            Go to sign in
          </Link>
        </div>
      ) : null}

      {currentUserQuery.data ? (
        <>
          {enrollTotpMutation.isPending ? (
            <p className="text-sm text-zinc-500" aria-live="polite">
              Generating authenticator setup key...
            </p>
          ) : null}

          {enrollError ? (
            <AuthErrorAlert
              error={enrollError}
              variant={enrollError.kind === "rate_limited" ? "warning" : "error"}
            />
          ) : null}

          {manualEntryKey ? (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              <p className="font-medium">Manual entry key</p>
              <p className="mt-1 break-all font-mono text-xs">{manualEntryKey}</p>
            </div>
          ) : null}

          <form className="flex flex-col gap-4" onSubmit={handleVerify}>
            <AuthFormField
              id="verify-totp-code"
              label="Authenticator code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={8}
              value={code}
              onChange={(event) => setCode(sanitizeOtpCodeInput(event.target.value))}
              required
              disabled={!manualEntryKey || confirmCooldown.isCoolingDown}
            />

            {confirmError ? <AuthErrorAlert error={confirmError} /> : null}

            <button
              type="submit"
              disabled={
                !manualEntryKey ||
                !isValidOtpCode(trimmedCode) ||
                confirmTotpMutation.isPending ||
                confirmCooldown.isCoolingDown
              }
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {confirmCooldown.isCoolingDown
                ? `Try again in ${confirmCooldown.secondsRemaining}s`
                : confirmTotpMutation.isPending
                  ? "Verifying..."
                  : "Confirm authenticator"}
            </button>
          </form>

          {enrollCooldown.isCoolingDown ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Setup is temporarily rate limited. Try again in {enrollCooldown.secondsRemaining}s.
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
