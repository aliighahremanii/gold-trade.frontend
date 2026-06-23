import Link from "next/link";

import { getAccessDeniedDescription } from "@/modules/identity/utils/access-denied-description";
import { sanitizeNextPath } from "@/modules/identity/utils/auth-redirect";

type AccessDeniedFlowProps = {
  nextPath?: string;
  reason?: string;
};

export function AccessDeniedFlow({ nextPath, reason }: AccessDeniedFlowProps) {
  const destination = nextPath ? sanitizeNextPath(nextPath) : undefined;
  const description = getAccessDeniedDescription(reason, destination);

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">identity</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Access denied</h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/dashboard"
          className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Go to customer dashboard
        </Link>
        <Link
          href="/sign-in"
          className="rounded-md border border-zinc-300 px-4 py-2 font-medium text-zinc-900 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-600"
        >
          Sign in with a different account
        </Link>
      </div>
    </section>
  );
}
