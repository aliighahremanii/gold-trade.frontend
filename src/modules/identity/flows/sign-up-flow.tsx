"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isNormalizedApiError } from "@/modules/identity/api/auth-request";
import { useSignUp } from "@/modules/identity/api/use-sign-up";
import { AuthErrorAlert } from "@/modules/identity/components/auth-error-alert";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { resolvePostAuthPath } from "@/modules/identity/utils/auth-redirect";
import { clearMobileVerificationAck } from "@/modules/identity/utils/mobile-verification-ack-storage";
import {
  hasSignUpFieldErrors,
  validateSignUpFields,
} from "@/modules/identity/utils/sign-up-validation";

export function SignUpFlow() {
  const router = useRouter();
  const signUpMutation = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ReturnType<typeof validateSignUpFields>>({});
  const apiError = isNormalizedApiError(signUpMutation.error) ? signUpMutation.error : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors = validateSignUpFields({ mobileNumber, nationalCode });
    setFieldErrors(nextFieldErrors);

    if (hasSignUpFieldErrors(nextFieldErrors)) {
      return;
    }

    try {
      const tokens = await signUpMutation.mutateAsync({
        email,
        password,
        mobileNumber: mobileNumber.trim(),
        nationalCode: nationalCode.trim(),
      });
      clearMobileVerificationAck();
      router.push(resolvePostAuthPath(tokens, "/dashboard"));
      router.refresh();
    } catch {
      // Error state is rendered from the mutation result.
    }
  }

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">identity</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Sign up</h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Create an account to access wallet, trading, and delivery workflows.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <AuthFormField
          id="sign-up-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <AuthFormField
          id="sign-up-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <AuthFormField
          id="sign-up-mobile"
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          placeholder="09xxxxxxxxx"
          value={mobileNumber}
          onChange={(event) => {
            const value = event.target.value;
            setMobileNumber(value);
            setFieldErrors(validateSignUpFields({ mobileNumber: value, nationalCode }));
          }}
          error={fieldErrors.mobileNumber}
          required
        />
        <AuthFormField
          id="sign-up-national-code"
          label="National code"
          inputMode="numeric"
          value={nationalCode}
          onChange={(event) => {
            const value = event.target.value;
            setNationalCode(value);
            setFieldErrors(validateSignUpFields({ mobileNumber, nationalCode: value }));
          }}
          error={fieldErrors.nationalCode}
          required
        />

        <AuthErrorAlert error={apiError} />

        <button
          type="submit"
          disabled={signUpMutation.isPending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {signUpMutation.isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-zinc-900 underline dark:text-zinc-50">
          Sign in
        </Link>
      </p>
    </section>
  );
}
