"use client";

import { useCurrentUser } from "@/modules/identity/api/use-current-user";

export function SessionStatusPanel() {
  const currentUserQuery = useCurrentUser();

  if (currentUserQuery.isLoading) {
    return (
      <p className="text-sm text-zinc-500" aria-live="polite">
        Loading session...
      </p>
    );
  }

  if (currentUserQuery.isError) {
    return (
      <p className="text-sm text-amber-700 dark:text-amber-300" aria-live="polite">
        Session could not be loaded.
      </p>
    );
  }

  if (!currentUserQuery.data) {
    return (
      <p className="text-sm text-zinc-500" aria-live="polite">
        No active session.
      </p>
    );
  }

  return (
    <div className="text-right text-sm text-zinc-600 dark:text-zinc-300">
      <p className="font-medium text-zinc-900 dark:text-zinc-50">{currentUserQuery.data.email}</p>
      <p>{currentUserQuery.data.status}</p>
    </div>
  );
}
