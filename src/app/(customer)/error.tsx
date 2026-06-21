"use client";

import { RouteErrorPanel } from "@/shared/layout/route-boundary-panels";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorPanel error={error} reset={reset} />;
}
