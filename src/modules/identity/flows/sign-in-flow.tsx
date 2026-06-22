"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isNormalizedApiError } from "@/modules/identity/api/auth-request";
import { useSignIn } from "@/modules/identity/api/use-sign-in";
import { AuthErrorAlert } from "@/modules/identity/components/auth-error-alert";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { resolvePostAuthPath, sanitizeNextPath } from "@/modules/identity/utils/auth-redirect";
import { clearMobileVerificationAck } from "@/modules/identity/utils/mobile-verification-ack-storage";
import { getSignInDescription } from "@/modules/identity/utils/sign-in-description";

type SignInFlowProps = {
  nextPath?: string;
  reason?: string;
};

export function SignInFlow({ nextPath, reason }: SignInFlowProps) {
  const router = useRouter();
  const signInMutation = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const destination = sanitizeNextPath(nextPath);
  const description = getSignInDescription(nextPath, reason);
  const error = isNormalizedApiError(signInMutation.error) ? signInMutation.error : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const tokens = await signInMutation.mutateAsync({ email, password });
      clearMobileVerificationAck();
      router.push(resolvePostAuthPath(tokens, destination));
      router.refresh();
    } catch {
      // Error state is rendered from the mutation result.
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">identity</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Sign in</h1>
        {description ? (
          <p className="text-base text-zinc-600 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthFormField
          id="sign-in-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <AuthFormField
          id="sign-in-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <AuthErrorAlert error={error} />

        <button
          type="submit"
          disabled={signInMutation.isPending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {signInMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Need an account?{" "}
        <Link href="/sign-up" className="font-medium text-zinc-900 underline dark:text-zinc-50">
          Sign up
        </Link>
      </p>
    </section>
  );
}
