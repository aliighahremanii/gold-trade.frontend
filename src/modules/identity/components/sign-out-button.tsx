"use client";

import { useRouter } from "next/navigation";

import { useSignOut } from "@/modules/identity/api/use-sign-out";
import { isNormalizedApiError } from "@/modules/identity/api/auth-request";

export function SignOutButton() {
  const router = useRouter();
  const signOutMutation = useSignOut();

  async function handleSignOut() {
    try {
      await signOutMutation.mutateAsync();
      router.push("/sign-in?reason=signed_out");
      router.refresh();
    } catch {
      router.push("/sign-in?reason=sign_out_failed");
      router.refresh();
    }
  }

  const error = isNormalizedApiError(signOutMutation.error) ? signOutMutation.error : null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signOutMutation.isPending}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
      >
        {signOutMutation.isPending ? "Signing out..." : "Sign out"}
      </button>
      {error ? <p className="text-xs text-red-700 dark:text-red-300">{error.message}</p> : null}
    </div>
  );
}
